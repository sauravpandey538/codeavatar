import { NextResponse } from "next/server";
import db from "@/utils/db";
import { getAuth } from "firebase-admin/auth";
import { app } from "@/utils/firebase-admin";
import { getAuthCookieFromRequest } from "@/lib/cookies";

// Helper function to get user ID from token
async function getUserIdFromToken(token: string) {
  const decodedToken = await getAuth(app).verifyIdToken(token);
  const user = await db("users")
    .where("firebase_uid", decodedToken.uid)
    .first();
  return user?.id;
}

// DELETE /api/contacts/[id]
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = getAuthCookieFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid contact ID" },
        { status: 400 }
      );
    }

    // Verify contact belongs to user
    const existingContact = await db("contacts")
      .where({ id, user_id: userId })
      .first();

    if (!existingContact) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    await db("contacts").where({ id }).delete();

    return NextResponse.json({ message: "Contact deleted successfully" });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
