import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGODB_URI || "");

// Initialize Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or use another email service like SendGrid
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// POST /api/register
export async function POST(req: Request) {
  try {
    // Parse request body
    const { name, email, password, referralCode } = await req.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await client.connect();
    const db = client.db("your_database");
    const usersCollection = db.collection("users");
    const codesCollection = db.collection("verification_codes");
    const pendingUsersCollection = db.collection("pending_users");

    // Check if email already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store verification code with expiration (10 minutes)
    await codesCollection.insertOne({
      email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    });

    // Send email with verification code
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}. It expires in 10 minutes.`,
    });

    // Temporarily store user data in pending_users
    await pendingUsersCollection.insertOne({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      referralCode,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { success: true, message: "Verification code sent to your email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}