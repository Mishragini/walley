
import { JWT_SECRET_KEY } from "@/lib/config";
import * as jwt from "jsonwebtoken"
import { cookies } from "next/headers"

interface User {
    email: string;
    password: string;
    id: string;
}


export async function setCookie(payload: User) {
    const secret_key = JWT_SECRET_KEY

    const auth_token = jwt.sign(payload, secret_key)

    const cookie_store = await cookies()
    cookie_store.set("auth-token", auth_token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/"
    })
}