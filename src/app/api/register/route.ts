import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

// Generate unique referral code
function generateRefCode(name: string): string {
  return `${name.toLowerCase().replace(/\s+/g, "")}-${nanoid(6)}`;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    await connectDB();

    const { name, email, password, referralCode } =
      await req.json();

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user's referral code
    const userReferralCode = generateRefCode(name);

    // Default
    let referredBy: string | null = null;

    // If referred via link
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        referredBy = referrer._id.toString(); // ✅ store _id
      }
    }

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      referralCode: userReferralCode,
      referredBy,
      team: "admin",
      teamMembers: [],
      totalTeam: 0,
      activeUsers: 0,
      wallet: 0,
      level: 1,
    });

    // Update referrer's team if valid
    if (referredBy) {
      await User.findByIdAndUpdate(referredBy, {
        $push: { teamMembers: newUser._id },
        $inc: { totalTeam: 1 },
      });
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) throw new Error("JWT_SECRET is missing");

    const token = jwt.sign({ id: newUser._id }, jwtSecret, { expiresIn: "7d" });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      token,
      user: newUser,
      referralLink: `${process.env.NEXT_PUBLIC_BASE_URL}/register?ref=${userReferralCode}`,
    });

  } catch (error: unknown) {
    console.error("Registration Error:", error);
    const message = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ success: false, message: "Server Error", error: message }, { status: 500 });
  }
}
