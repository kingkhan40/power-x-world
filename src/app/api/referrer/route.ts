import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const ref = searchParams.get("ref");

    if (!ref) {
      return NextResponse.json(
        { success: false, message: "Referral code missing" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ referralCode: ref }).select("name email referralCode");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Referrer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      name: user.name,
      referralCode: user.referralCode,
    });
  } catch (error) {
    console.error("Referrer API Error:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching referrer" },
      { status: 500 }
    );
  }
}
