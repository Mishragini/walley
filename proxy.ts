import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const token = request.cookies.get("auth-token")
    if ( request.nextUrl.pathname === "/") {
        if(token){
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/"],
};