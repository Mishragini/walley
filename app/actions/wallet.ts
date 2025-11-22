"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./getUser";
import { generateEthWallet, generateSolanaWallet } from "@/lib/wallet";
import { revalidatePath } from "next/cache";

export async function addAccount(accountIndex: number, seed: string, selectedNetworks: string[]) {
    const { userId } = await getUser()
    let solanaPubkey = "";
    let ethPubKey = "";

    const deserializedSeed = Buffer.from(seed, "base64")


    try {
        if (selectedNetworks.includes("solana")) {
            const derivationPath = `m/44'/501'/${accountIndex}'/0'`;
            const keypair = await generateSolanaWallet(derivationPath, deserializedSeed);
            solanaPubkey = keypair.publicKey.toBase58()
        }
        if (selectedNetworks.includes("ethereum")) {
            const derivationPath = `m/44'/60'/0'/0/${accountIndex}`;
            const wallet = await generateEthWallet(derivationPath, deserializedSeed);
            ethPubKey = wallet.address
        }
        await prisma.account.create({
            data: {
                ethPublicKey: ethPubKey,
                solPublicKey: solanaPubkey,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        revalidatePath("/dashboard")
        return { success: "Account added" }

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unable to add account"
        return { error: errorMessage }
    }
}

export async function getUserAccounts() {
    const { userId } = await getUser()
    try {
        const userAccounts = await prisma.account.findMany({
            where: {
                userId
            }
        })

        return { userAccounts }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Accounts fetch failed "
        return { error: errorMessage }
    }
}