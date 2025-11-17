"use server";
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt";
import { signinInputs } from "../validations";
import { setCookie } from "./setCookie";

export async function signIn(values: signinInputs) {
    const { email, password } = values;
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

    await setCookie(user)

    return { success: "User logged in successfully" }
}
