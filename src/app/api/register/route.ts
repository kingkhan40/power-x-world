import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DATABASE_NAME = "powerxworld"; // your actual database name

// Global cached client (recommended for Vercel)
let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectDB() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DATABASE_NAME);

  cachedClient = client;
  cachedDb = db;
  return { client, db };
}

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// POST /api/register
export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const { db } = await connectDB();
    const usersCollection = db.collection("users");
    const codesCollection = db.collection("verification_codes");
    const pendingUsersCollection = db.collection("pending_users");

    // Check if email already exists in users or pending_users
    const existingUser = await usersCollection.findOne({ email });
    const pendingUser = await pendingUsersCollection.findOne({ email });

    if (existingUser || pendingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await codesCollection.insertOne({
      email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Your verification code is: ${verificationCode}. It expires in 10 minutes.`,
    });

    // Store user temporarily
    await pendingUsersCollection.insertOne({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      referralCode: referralCode || null,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Verification code sent to your email" }, { status: 200 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
