import { NextResponse } from "next/server";
import db from "@/utils/db";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/utils/firebase-admin";
import { createAuthCookie } from "@/lib/cookies";

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "ID token is required" },
        { status: 400 }
      );
    }

    // Verify the ID token
    const decodedToken = await getAuth(app).verifyIdToken(idToken);

    // Check if user exists in database
    let user = await db("users")
      .where("firebase_uid", decodedToken.uid)
      .first();

    // If user doesn't exist, create them
    if (!user) {
      const [newUser] = await db("users")
        .insert({
          firebase_uid: decodedToken.uid,
          email: decodedToken.email,
          display_name:
            decodedToken.name || decodedToken.email?.split("@")[0] || "",
          photo_url: decodedToken.picture,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .returning("*");

      user = newUser;
    }

    // Create response with user data
    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.display_name,
      },
    });

    // Set the auth cookie in response headers
    response.headers.set("Set-Cookie", createAuthCookie(idToken));

    return response;
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
