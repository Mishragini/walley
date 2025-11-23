"use server";

import prisma from "@/lib/prisma";
import { getUser } from "./getUser";
import { generateEthWallet, generateSolanaWallet } from "@/lib/wallet";
import { revalidatePath } from "next/cache";
import { AccountData } from "@/lib/type";

export async function addAccount(seed: string, selectedNetworks: string[], accountIndex?: number, currentAccount?: AccountData) {
    const index = accountIndex ? accountIndex : currentAccount?.accountIndex

    if (!index) {
        throw Error("Error adding Account. Couldn't determine the index.")
    }

    const { userId } = await getUser()
    let solanaPubkey = currentAccount?.solPublicKey || "";
    let ethPubKey = currentAccount?.ethPublicKey || "";

    const deserializedSeed = Buffer.from(seed, "base64")

    try {
        if (selectedNetworks.includes("solana")) {
            const derivationPath = `m/44'/501'/${index}'/0'`;
            const keypair = await generateSolanaWallet(derivationPath, deserializedSeed);
            solanaPubkey = keypair.publicKey.toBase58()
        }
        if (selectedNetworks.includes("ethereum")) {
            const derivationPath = `m/44'/60'/0'/0/${index}`;
            const wallet = await generateEthWallet(derivationPath, deserializedSeed);
            ethPubKey = wallet.address
        }
        const existingAccount = await prisma.account.findFirst({
            where: {
                accountIndex: index,
                userId
            }
        })

        if (existingAccount) {
            await prisma.account.update({
                where: {
                    id: existingAccount.id
                },
                data: {
                    ethPublicKey: ethPubKey,
                    solPublicKey: solanaPubkey,
                }
            })
        } else {
            await prisma.account.create({
                data: {
                    accountIndex: index,
                    ethPublicKey: ethPubKey,
                    solPublicKey: solanaPubkey,
                    user: {
                        connect: {
                            id: userId
                        }
                    }
                }
            })
        }
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