// app/api/register/route.ts
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "";
const DATABASE_NAME = "powerxworld";

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

async function connectDB() {
  if (cachedClient && cachedDb) return { client: cachedClient, db: cachedDb };

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DATABASE_NAME);

    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (error) {
    console.error("Database connection error:", error);
    throw new Error("Failed to connect to database");
  }
}

// Nodemailer transporter with better error handling
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// POST /api/register
export async function POST(req: Request) {
  try {
    const { name, email, password, referralCode } = await req.json();

    console.log("Registration attempt:", { name, email, referralCode });

    if (!name || !email || !password) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters" }, { status: 400 });
    }

    const { db } = await connectDB();
    const usersCollection = db.collection("users");
    const codesCollection = db.collection("verification_codes");
    const pendingUsersCollection = db.collection("pending_users");

    console.log("Database connected, checking existing users...");

    // Check if email already exists in users or pending_users
    const existingUser = await usersCollection.findOne({ email });
    const pendingUser = await pendingUsersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ message: "Email already registered" }, { status: 400 });
    }

    if (pendingUser) {
      return NextResponse.json({ message: "Verification already sent to this email" }, { status: 400 });
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Generated verification code for:", email);

    // Store verification code
    await codesCollection.insertOne({
      email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      createdAt: new Date(),
    });

    console.log("Verification code stored");

    // Send email
    try {
      const transporter = createTransporter();
      
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Email - PowerX World",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to PowerX World!</h2>
            <p>Your verification code is:</p>
            <h1 style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; letter-spacing: 5px;">
              ${verificationCode}
            </h1>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
        `,
      });
      console.log("Verification email sent to:", email);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail registration if email fails, just log it
    }

    // Store user temporarily
    const hashedPassword = await bcrypt.hash(password, 12);
    
    await pendingUsersCollection.insertOne({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      referralCode: referralCode || null,
      createdAt: new Date(),
    });

    console.log("User stored in pending_users");

    return NextResponse.json({ 
      success: true, 
      message: "Verification code sent to your email" 
    }, { status: 200 });

  } catch (error) {
    console.error("Registration error:", error);
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes("connect")) {
        return NextResponse.json({ message: "Database connection failed" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}