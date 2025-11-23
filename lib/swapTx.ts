import { JsonRpcProvider, Wallet } from "ethers"
import { ETH_RPC_ENDPOINT, SOL_RPC_ENDPOINT } from "./config"
import { AddressLookupTableAccount, Connection, Keypair, LAMPORTS_PER_SOL, MessageV0, PublicKey, TransactionInstruction, TransactionMessage, VersionedTransaction } from "@solana/web3.js"
import { getWallet } from "./wallet"
import { getAddressLookupTableAccounts } from '@mayanfinance/swap-sdk';

interface txDataEth {
    data: string,
    to: string,
    chainId: number,
    value: string
}
interface Key {
    pubkey: string,
    isSigner: boolean,
    isWritable: boolean
}
interface instruction {
    programId: string,
    keys: Key[],
    data: number[]
}

interface solTxData {
    instructions: instruction[],
    lookupTables: string[],
    signers: Array<number[]> | Uint8Array[]
}

interface txDataSol {
    data: solTxData,
    chainId: string,
    value: string
}


export async function swapEthTxn(tx: txDataEth, accountIndex: number) {
    const wallet = await getWallet("ethereum", accountIndex) as Wallet
    const rpcUrl = ETH_RPC_ENDPOINT

    const connection = new JsonRpcProvider(rpcUrl)

    const signer = new Wallet(wallet.privateKey, connection)
    const addr = await signer.getAddress();
    const bal = await connection.getBalance(addr);

    const response = await signer.sendTransaction(tx)

    return response

}

export async function swapSolTxn(tx: txDataSol, accountIndex: number) {
    const keypair = await getWallet("solana", accountIndex) as Keypair;

    const rpcUrl = SOL_RPC_ENDPOINT;
    if (!rpcUrl) throw new Error(" No Solana RPC URL found");

    const connection = new Connection(rpcUrl);


    // --------------------------------------------------------
    // 1. BUILD INSTRUCTIONS SAFELY
    // --------------------------------------------------------
    const instructions = tx.data.instructions.map((ix) => {
        let ixData: Uint8Array;

        if (Array.isArray(ix.data)) {
            ixData = Uint8Array.from(ix.data);
        } else if (typeof ix.data === "string") {
            // Try base64 decode (some APIs send data as base64)
            try {
                ixData = Buffer.from(ix.data, "base64");
            } catch (e) {
                ixData = Buffer.from(ix.data); // fallback
            }
        } else {
            ixData = Buffer.from(ix.data);
        }

        return new TransactionInstruction({
            programId: new PublicKey(ix.programId),
            keys: ix.keys.map((k) => ({
                pubkey: new PublicKey(k.pubkey),
                isSigner: k.isSigner,
                isWritable: k.isWritable,
            })),
            data: Buffer.from(ixData),
        });
    });

    const lookupTables = await getAddressLookupTableAccounts(
        tx.data.lookupTables,
        connection
    );

    const lutAccounts: AddressLookupTableAccount[] = lookupTables.filter(Boolean);


    const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("finalized");

    const messageV0 = new TransactionMessage({
        payerKey: keypair.publicKey,
        recentBlockhash: blockhash,
        instructions,
    }).compileToV0Message(lutAccounts);

    const transaction = new VersionedTransaction(messageV0);
    const additionalSigners: Keypair[] = [];

    if (tx.data.signers && tx.data.signers.length > 0) {
        for (const s of tx.data.signers) {
            additionalSigners.push(Keypair.fromSecretKey(Uint8Array.from(s)));
        }
    }

    transaction.sign([keypair, ...additionalSigners]);

    const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        { skipPreflight: false, preflightCommitment: "confirmed" }
    );

    const confirmation = await connection.confirmTransaction(
        {
            signature,
            blockhash,
            lastValidBlockHeight,
        },
        "confirmed"
    );

    if (confirmation.value.err) {
        throw new Error(` Solana transaction failed: ${confirmation.value.err}`);
    }

    return signature;
}