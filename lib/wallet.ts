import { getUser } from "@/app/actions/getUser";
import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";
import { db } from "./indexedDb";

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


export async function getWallet(network: string, accountIndex: number) {
    const { userId } = await getUser();

    const seed = await db.seeds.get({ id: userId });

    if (!seed) {
        throw new Error("Seed not found in indexed db");
    }

    const seedBuffer = Buffer.from(seed.value, "base64");

    if (network === "solana") {
        const derivationPath = `m/44'/501'/${accountIndex - 1}'/0'`;

        const keypair = await generateSolanaWallet(
            derivationPath,
            seedBuffer
        );

        return keypair
    } else if (network === "ethereum") {
        const derivationPath = `m/44'/60'/0'/0/${accountIndex - 1}`;
        const wallet = await generateEthWallet(
            derivationPath,
            seedBuffer
        );
        return wallet
    }

}









