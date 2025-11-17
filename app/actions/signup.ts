"use server";

import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt"
import { setCookie } from "./setCookie";

export async function signup(email: string, password: string) {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })

    if (user) {
        return { error: "User with this email already exists" }
    }

    const hashed_password = await bcrypt.hash(password, 10)

    const new_user = await prisma.user.create({
        data: {
            email,
            password: hashed_password
        }
    })

    await setCookie(new_user)

    return { success: "User created successfully" }
}