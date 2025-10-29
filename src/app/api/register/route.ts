import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export async function POST(req: Request) {
  try {
    await connectDB();

    // Parse and log request body
    const { name, email, password, referralCode: referredBy } = await req.json();
    console.log("📥 Incoming data:", { name, email, password, referredBy });

    // ✅ Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create a unique, readable referral code (e.g., "talha-0ya6tB")
    const cleanedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const randomPart = Math.random().toString(36).substring(2, 8);
    const newReferralCode = `${cleanedName}-${randomPart}`;

    // ✅ Create unverified user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredBy || null,
      isVerified: false,
    });

    // ✅ Generate a 6-digit email verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
    });

    // ✅ Configure email transport (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send verification email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family:sans-serif">
          <h2>Welcome, ${name}!</h2>
          <p>Your verification code is:</p>
          <h3 style="color:#007bff">${code}</h3>
          <p>This code expires in 10 minutes.</p>
        </div>
      `,
    });

    // ✅ Return success with referral link
    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      referralLink: `https://www.powerxworld.uk/register?ref=${newReferralCode}`,
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
