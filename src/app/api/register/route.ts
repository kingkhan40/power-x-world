import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, password, referralCode: referredBy } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json(
        { success: false, message: "All fields required" },
        { status: 400 }
      );

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 }
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique referral code for the new user
    const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Prepare user data
    const userData: any = {
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredBy || null,
      isVerified: false,
    };

    // Create user (unverified for now)
    const user = await User.create(userData);

    // Generate and save verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await VerificationCode.create({
      email,
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    });

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send verification email
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

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
