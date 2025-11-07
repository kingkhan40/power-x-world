import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import User from "@/models/User";
import Stake from "@/models/Stake";
import { getRewardPercent } from "@/utils/stakeHelper";
import { connectDB } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { userId, amount } = await req.json();
    if (!userId || !amount) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    if (user.wallet < amount) {
      return NextResponse.json({ success: false, message: "Insufficient balance" }, { status: 400 });
    }

    const rewardPercent = getRewardPercent(amount);

    // Deduct amount from user wallet
    user.wallet -= amount;
    await user.save();

    // Create new stake
    const stake = new Stake({
      userId,
      amount,
      rewardPercent,
      totalReward: 0,
      status: "active",
    });

    await stake.save();

    return NextResponse.json({
      success: true,
      message: "Stake created successfully",
      stake,
    });
  } catch (error: any) {
    console.error("Stake creation error:", error);
    return NextResponse.json({ success: false, message: "Server error", error: error.message }, { status: 500 });
  }
}
