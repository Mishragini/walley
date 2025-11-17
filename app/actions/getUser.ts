"use server";

import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken"
import { redirect } from "next/navigation";

export async function getUser() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get("auth-token")?.value;
    if (!authToken) {
        redirect("/signin")
    }

    const decoded = jwt.decode(authToken) as jwt.JwtPayload;

    const { id: userId } = decoded

    return { success: "User fetched successfully", userId }

}