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

// GET /api/contacts
export async function GET(req: Request) {
  try {
    const token = getAuthCookieFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const contacts = await db("contacts")
      .where("user_id", userId)
      .orderBy("created_at", "desc");

    return NextResponse.json({ contacts });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// POST /api/contacts
export async function POST(req: Request) {
  try {
    const token = getAuthCookieFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { name, email, phone, company, job_title, notes } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const [contact] = await db("contacts")
      .insert({
        user_id: userId,
        name,
        email,
        phone,
        company,
        job_title,
        notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .returning("*");

    return NextResponse.json({ contact });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// PUT /api/contacts
export async function PUT(req: Request) {
  try {
    const token = getAuthCookieFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id, name, email, phone, company, job_title, notes } =
      await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "ID and name are required" },
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

    const [contact] = await db("contacts")
      .where({ id })
      .update({
        name,
        email,
        phone,
        company,
        job_title,
        notes,
        updated_at: new Date().toISOString(),
      })
      .returning("*");

    return NextResponse.json({ contact });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
