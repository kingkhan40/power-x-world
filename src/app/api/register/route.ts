import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import VerificationCode from "@/models/VerificationCode";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, referralCode: referralCodeFromClient } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
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

    // ✅ Find the user who referred (if any)
    let referredByUser = null;
    if (referralCodeFromClient) {
      referredByUser = await User.findOne({
        referralCode: { $regex: new RegExp(`^${referralCodeFromClient}$`, "i") },
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate new referral code like saad-0ya6tB
    const cleanedName = name.trim().toLowerCase().replace(/\s+/g, "-");
    const randomPart = Math.random().toString(36).substring(2, 8);
    const newReferralCode = `${cleanedName}-${randomPart}`;

    // ✅ Create new unverified user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: newReferralCode,
      referredBy: referredByUser ? referredByUser._id : null,
      team: referredByUser ? referredByUser.name : null,
      isVerified: false,
      wallet: 0,
      totalTeam: 0,
      teamMembers: [],
    });

    // ✅ If referred, add new user to referrer’s team
    if (referredByUser) {
      await User.findByIdAndUpdate(referredByUser._id, {
        $push: { teamMembers: newUser._id },
        $inc: { totalTeam: 1 },
      });
      console.log(`✅ ${newUser.name} added to ${referredByUser.name}'s team`);
    }

    // ✅ Generate 6-digit email verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await VerificationCode.create({
      email,
      code: verificationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
    });

    // ✅ Configure email (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Send verification mail
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #2447e4ff 0%, #7524c5ff 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">PowerX World Supreme</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Email Verification</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${name}!</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.6;">
              Your verification code is:
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; border: 2px dashed #667eea; text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">
                ${verificationCode}
              </span>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This code expires in 10 minutes.
            </p>
            
            <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px; border: 1px solid #ffeaa7;">
              <p style="margin: 0; color: #856404; font-size: 12px;">
                If you didn't request this code, please ignore this email.
              </p>
            </div>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 12px;">
              &copy; 2024 PowerX World Supreme. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    // ✅ Return success + user's own referral link
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
