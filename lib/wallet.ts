import { Keypair } from "@solana/web3.js";
import { derivePath } from "ed25519-hd-key";
import { Wallet } from "ethers";
import { HDNodeWallet } from "ethers";

export async function generateSolanaWallet(derivationPath: string, seed: Buffer<ArrayBufferLike>) {
    const derivedSeed = derivePath(derivationPath, seed.toString("hex")).key;
    const { publicKey } = Keypair.fromSeed(derivedSeed);
    return publicKey.toBase58();
}

export async function generateEthWallet(derivationPath: string, seed: Buffer<ArrayBufferLike>) {
    const hdNode = HDNodeWallet.fromSeed(seed);

    const child = hdNode.derivePath(derivationPath);

    const wallet = new Wallet(child.privateKey);

    return wallet.address;
}


