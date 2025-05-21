import { NextResponse } from "next/server";
import { getAuthCookieFromRequest } from "@/lib/cookies";
import { getUserIdFromToken } from "@/lib/auth";
import db from "@/utils/db";

export async function POST(req: Request) {
  try {
    // Get auth token from cookie
    const token = getAuthCookieFromRequest(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from token
    const userId = await getUserIdFromToken(token);
    if (!userId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get spreadsheet ID and range from request
    const { spreadsheetId, range } = await req.json();
    if (!spreadsheetId || !range) {
      return NextResponse.json(
        { error: "Spreadsheet ID and range are required" },
        { status: 400 }
      );
    }

    // Get data from Google Sheets API
    const sheetsResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/sheets`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spreadsheetId, range }),
      }
    );

    const sheetsData = await sheetsResponse.json();
    if (!sheetsResponse.ok) {
      throw new Error(sheetsData.error || "Failed to fetch sheet data");
    }

    // Insert contacts into database
    const insertedContacts = await Promise.all(
      sheetsData.data.map(async (contact: any) => {
        const [newContact] = await db("contacts")
          .insert({
            user_id: userId,
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
            company: contact.company,
            job_title: contact.job_title,
            notes: contact.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .returning("*");

        return newContact;
      })
    );

    return NextResponse.json({
      message: "Contacts imported successfully",
      contacts: insertedContacts,
    });
  } catch (error: any) {
    console.error("Error importing contacts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to import contacts" },
      { status: 500 }
    );
  }
}
