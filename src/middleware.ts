import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const auth = cookies().get("email")?.value;
  if (auth) {
    if (request.nextUrl.pathname.startsWith("/auth")) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    return NextResponse.next();
  } else {
    if (
      request.url === "/" ||
      request.url === "/auth/register" ||
      request.url === "/auth/login"
    ) {
      console.log("rendered");
      return null;
    }
  }
}

export const config = {
  matcher: [
    "/",
    "/about/:path*",
    "/product/:path*",
    "/profile/:path*",
    "/auth/:path*",
  ],
};
