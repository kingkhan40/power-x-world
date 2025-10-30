// /app/api/verify/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const client = new MongoClient(process.env.MONGODB_URI || "");

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    // Validate input
    if (!email || !code) {
      return NextResponse.json(
        { message: "Email and code are required" },
        { status: 400 }
      );
    }

    await client.connect();
    const db = client.db("your_database");
    const codesCollection = db.collection("verification_codes");
    const pendingUsersCollection = db.collection("pending_users");
    const usersCollection = db.collection("users");

    // Find verification code
    const verification = await codesCollection.findOne({ email, code });
    if (!verification) {
      return NextResponse.json(
        { message: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // Check if code is expired
    if (new Date() > verification.expiresAt) {
      await codesCollection.deleteOne({ email, code });
      return NextResponse.json({ message: "Code expired" }, { status: 400 });
    }

    // Find pending user
    const pendingUser = await pendingUsersCollection.findOne({ email });
    if (!pendingUser) {
      return NextResponse.json(
        { message: "No pending user found" },
        { status: 400 }
      );
    }

    // Move user to main users collection
    await usersCollection.insertOne({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      referralCode: pendingUser.referralCode || null,
      createdAt: new Date(),
    });

    // Clean up
    await codesCollection.deleteOne({ email, code });
    await pendingUsersCollection.deleteOne({ email });

    return NextResponse.json({
      success: true,
      message: "Email verified and account created",
      user: { name: pendingUser.name, email: pendingUser.email },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    await client.close();
  }
}