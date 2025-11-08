// app/api/referrer/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Referral code missing" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      referralCode: { $regex: new RegExp(`^${code}$`, "i") },
    }).select("name email referralCode");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid referral code" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      email: user.email,
      referralCode: user.referralCode,
    });
  } catch (err) {
    console.error("Referrer Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}