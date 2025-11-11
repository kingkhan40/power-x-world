import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

/**
 * 🧠 Route: POST /api/user/wallet
 * Body: { userId: string, walletAddress: string }
 */
export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, walletAddress } = await req.json();

    if (!userId || !walletAddress) {
      return NextResponse.json(
        { success: false, message: "userId and walletAddress are required" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { walletAddress },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Wallet address updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("❌ Wallet update error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
