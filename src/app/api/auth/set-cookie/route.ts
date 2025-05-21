import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Set the cookie
    setAuthCookie(token);

    return NextResponse.json({ message: "Cookie set successfully" });
  } catch (error: any) {
    console.error("Error setting cookie:", error);
    return NextResponse.json(
      { error: error.message || "Failed to set cookie" },
      { status: 500 }
    );
  }
}
