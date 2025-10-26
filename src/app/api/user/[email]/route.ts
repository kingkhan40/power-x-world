import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface RouteParams {
  params: {
    email: string;
  };
}

// ✅ GET — Fetch user details by email or userId
export async function GET(request: Request, context: RouteParams) {
  try {
    await connectDB();

    // ✅ Await params properly (Next.js requires this)
    const params = await context.params;
    const emailOrId = params.email;

    if (!emailOrId) {
      return NextResponse.json(
        { success: false, message: "Email or ID is required" },
        { status: 400 }
      );
    }

    // ✅ Detect if it's ObjectId or Email
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(emailOrId);

    const user = isObjectId
      ? await User.findById(emailOrId)
      : await User.findOne({ email: emailOrId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Dynamic referral link
    const referralLink = `https://www.powerxworld.uk/register?ref=${user.referralCode}`;

    return NextResponse.json({
      success: true,
      user,
      referralLink,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}

// ✅ POST — Save wallet address
export async function POST(request: Request, context: RouteParams) {
  try {
    await connectDB();
    const params = await context.params;
    const emailOrId = params.email;

    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { success: false, message: "Wallet address is required" },
        { status: 400 }
      );
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(emailOrId);

    const user = isObjectId
      ? await User.findByIdAndUpdate(
          emailOrId,
          { $set: { walletAddress } },
          { new: true }
        )
      : await User.findOneAndUpdate(
          { email: emailOrId },
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
    console.error("❌ Error saving wallet:", error);
    return NextResponse.json(
      { success: false, message: "Server error", error: String(error) },
      { status: 500 }
    );
  }
}
