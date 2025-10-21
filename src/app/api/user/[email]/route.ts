import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface RouteParams {
  params: {
    email: string;
  };
}

// ✅ GET — Fetch user details by email & generate dynamic referral link
export async function GET(request: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { email } = params;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Construct referral link dynamically using referralCode
    const referralLink = `https://powerxworld.uk/register?ref=${user.referralCode}`;

    return NextResponse.json({ success: true, referralLink });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

// ✅ POST — Save user's wallet address
export async function POST(request: Request, { params }: RouteParams) {
  try {
    await connectDB();
    const { email } = params;
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: "Wallet address is required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { $set: { walletAddress } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Wallet address saved successfully",
      user,
    });
  } catch (error) {
    console.error("❌ Error saving wallet address:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
