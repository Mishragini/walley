"use server";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { signinInputs } from "../validations";
import { setCookie } from "./setCookie";
import { getWallet } from "@/lib/wallet";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Wallet } from "ethers";

export async function signIn(values: signinInputs) {
    const { email, password, mnemonic } = values;
    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!user) {
        return { error: "User does not exist. Please onboard first." };
    }

    const match = await bcrypt.compare(password, user?.password);
    if (!match) {
        return { error: "Password is incorrect." };
    }

    if (mnemonic) {
        const account = await prisma.account.findFirst({
            where: {
                userId: user.id,
                accountIndex: 1
            }
        })
        if (!account) {
            throw new Error("No accounts found for the user")
        }

        const solanaKeypair = await getWallet("solana", 1, mnemonic) as Keypair

        const ethWallet = await getWallet("ethereum", 1, mnemonic) as Wallet


        console.log("fhukitoieru", solanaKeypair, ethWallet)

        if (account.solPublicKey) {

            if (account.solPublicKey !== solanaKeypair.publicKey.toBase58()) {
                throw new Error("Mnemonic doesn't belong to the account")
            }
        }
        else if (account.ethPublicKey) {
            if (account.ethPublicKey !== ethWallet.address) {
                throw new Error("Mnemonic doesn't belong to the account")
            }
        }
    }

    await setCookie(user)

    return { userId: user.id }
}
