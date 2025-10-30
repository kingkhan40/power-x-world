import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stake from "@/models/Stake";
import User from "@/models/User";

/**
 * GET /api/stake/user?userId=xxxx
 * Returns all stakes of a user
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Get user with wallet info
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Get all stakes (active + completed)
    const stakes = await Stake.find({ userId }).sort({ createdAt: -1 });

    // ✅ Calculate total active staking amount
    const activeTotal = stakes
      .filter((s) => s.status === "active")
      .reduce((sum, s) => sum + s.amount, 0);

    // ✅ Calculate total earned rewards
    const totalRewards = stakes.reduce(
      (sum, s) => sum + (s.rewardsEarned || 0),
      0
    );

    return NextResponse.json({
      message: "User stakes fetched successfully ✅",
      walletBalance: user.wallet,
      activeTotal,
      totalRewards,
      stakes,
    });
  } catch (error) {
    console.error("❌ Error fetching user stakes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
