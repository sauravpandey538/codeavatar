import { cookies } from "next/headers";

// Cookie names
export const AUTH_TOKEN_COOKIE = "auth_token";

// Cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export function createAuthCookie(token: string) {
  const options = Object.entries(cookieOptions)
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");

  return `${AUTH_TOKEN_COOKIE}=${token}; ${options}`;
}

export function getAuthCookieFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[AUTH_TOKEN_COOKIE];
}

export function setAuthCookie(token: string) {
  cookies().set(AUTH_TOKEN_COOKIE, token, cookieOptions);
}

export function getAuthCookie() {
  return cookies().get(AUTH_TOKEN_COOKIE)?.value;
}

export function removeAuthCookie() {
  cookies().delete(AUTH_TOKEN_COOKIE);
}
