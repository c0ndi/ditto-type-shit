import type { NextRequest } from "next/server";
import { authConfig } from "./server/auth/config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";

// Use only one of the two middleware options below
// 1. Use middleware directly
// export const { auth: middleware } = NextAuth(authConfig)

// 2. Wrapped middleware option
const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/profile"];

export default auth(async function middleware(req: NextRequest) {
  const session = await auth();

  if (protectedRoutes.includes(req.nextUrl.pathname)) {
    if (!session) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  return NextResponse.next();
});
