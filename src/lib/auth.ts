import { getAuth } from "firebase-admin/auth";
import { app } from "@/utils/firebase-admin";
import db from "@/utils/db";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";

export async function getUserIdFromToken(
  token: string
): Promise<string | null> {
  try {
    // Verify the token
    const decodedToken = await getAuth(app).verifyIdToken(token);

    // Get user from database
    const user = await db("users")
      .where("firebase_uid", decodedToken.uid)
      .first();

    return user?.id || null;
  } catch (error) {
    console.error("Error getting user ID from token:", error);
    return null;
  }
}

export async function handleLogout() {
  try {
    // Sign out from Firebase
    await signOut(auth);

    // Clear the auth cookie by making a request to the logout endpoint
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include", // if you're using cookies
    });

    // Redirect to login page
    window.location.href = "/auth/login";
  } catch (error) {
    console.error("Error during logout:", error);
  }
}
