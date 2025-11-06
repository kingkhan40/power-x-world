import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stake from "@/models/Stake";
import User from "@/models/User";
import mongoose from "mongoose";

/**
 * ✅ GET /api/stake/user?userId=xxxx
 * User ke sare stakes + active stake + total earned + 3x max limit return karta hai
 */
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { error: "Invalid or missing userId" },
        { status: 400 }
      );
    }

    // ✅ User find karo (wallet ke liye)
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Sare stakes lao (active + completed)
    const stakes = await Stake.find({ userId }).sort({ createdAt: -1 });

    if (!stakes || stakes.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No stakes found for this user",
          walletBalance: user.wallet || 0,
          stakes: [],
          activeStake: null,
          totalEarned: 0,
          maxLimit: 0,
        },
        { status: 200 }
      );
    }

    // ✅ Active stake
    const activeStake = stakes.find((s) => s.status === "active");

    // ✅ Har stake ka earned, maxLimit, progress calculate karo
    const updatedStakes = stakes.map((s) => {
      const earned = s.totalReward || 0;
      const maxLimit = s.amount * 3;
      const progress = Math.min((earned / maxLimit) * 100, 100);
      return {
        ...s.toObject(),
        earned,
        maxLimit,
        progress, // UI bar ke liye
      };
    });

    // ✅ Total earned (sare stakes ka sum)
    const totalEarned = updatedStakes.reduce(
      (sum, s) => sum + (s.earned || 0),
      0
    );

    // ✅ Total max limit (UI ke total bar ke liye)
    const totalMaxLimit = updatedStakes.reduce(
      (sum, s) => sum + (s.maxLimit || 0),
      0
    );

    // ✅ Active stake ki individual max limit
    const activeMaxLimit = activeStake ? activeStake.amount * 3 : 0;

    return NextResponse.json(
      {
        success: true,
        message: "User stakes fetched successfully ✅",
        walletBalance: user.wallet || 0,
        activeStake: activeStake || null,
        totalEarned,
        maxLimit: activeMaxLimit, // active stake ka 3x
        totalMaxLimit, // total 3x (sab stakes ka)
        stakes: updatedStakes, // with progress data
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching user stakes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
