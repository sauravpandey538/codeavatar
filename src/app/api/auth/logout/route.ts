import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().delete("auth_token");
    const response = NextResponse.json({ message: "Logged out" });
    response.cookies.set("auth_token", "", { maxAge: 0 }); // delete cookie
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
