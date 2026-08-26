import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/login"
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isStatic = request.nextUrl.pathname.startsWith("/_next") ||
                   request.nextUrl.pathname.includes(".")

  if (isStatic) {
    return NextResponse.next()
  }

  if (isApiRoute && request.nextUrl.pathname !== "/api/auth/login") {
     const authCookie = request.cookies.get("neercloud_admin_auth")
     if (!authCookie || authCookie.value !== "authenticated") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
     }
  }

  if (isLoginPage || isApiRoute) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get("neercloud_admin_auth")

  if (!authCookie || authCookie.value !== "authenticated") {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
