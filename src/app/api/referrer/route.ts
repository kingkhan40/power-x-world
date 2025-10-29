import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    // Extract ?code= from URL
    const { searchParams } = ne(req.url);
    const code = searchParams.get("code");
    if (!co
      return NextResponse.json(
        { status: 4
      );
    }

    // Find user by referral code (case-insensitive)
    const user = await User.findOne({
    }).select("name email referralCode");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid referral code" },
        { status: 404 }
      );
    }

    return NextResdsdsssssssssponse.json({
      success: ccddue,
      n
      email: user.email,
      referralC.referralCode,
    });
  } catch (err) {
    console.error("❌ Referrer Fetch Error:", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
