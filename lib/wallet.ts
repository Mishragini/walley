import { getUser } from "@/app/actions/getUser";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";
import { db } from "./indexedDb";
import { toast } from "sonner";
import { mnemonicToSeedSync } from "bip39";

export async function generateSolanaWallet(derivationPath: string, seed: Buffer<ArrayBufferLike>) {
    const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
    const keypair = Keypair.fromSeed(derivedSeed);
    return keypair
}

export async function generateEthWallet(derivationPath: string, seed: Buffer<ArrayBufferLike>) {
    const hdNode = HDNodeWallet.fromSeed(seed);

    const child = hdNode.derivePath(derivationPath);

    const wallet = new Wallet(child.privateKey);

    return wallet
}


export async function getWallet(network: string, accountIndex: number, mnemonicPhrase?: string) {
    const { userId } = await getUser();

    let seed;

    if (!mnemonicPhrase) {
        const dbSeed = await db.seeds.get({ id: userId });

        if (!dbSeed) {
            toast.error("Mnemonic seed seems to be missing. Relogin and add back your mneomic phrase")
            return;
        }

        seed = dbSeed.value
    } else {
        seed = Buffer.from(mnemonicToSeedSync(mnemonicPhrase)).toString("base64");
    }



    const seedBuffer = Buffer.from(seed, "base64");

    if (network === "solana") {
        const derivationPath = `m/44'/501'/${accountIndex}'/0'`;

        const keypair = await generateSolanaWallet(
            derivationPath,
            seedBuffer
        );

        return keypair
    } else if (network === "ethereum") {
        const derivationPath = `m/44'/60'/0'/0/${accountIndex}`;
        const wallet = await generateEthWallet(
            derivationPath,
            seedBuffer
        );
        return wallet
    }

}










