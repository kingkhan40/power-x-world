import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Stake from "@/models/Stake";

/**
 * ✅ Get reward percent according to staking amount
 */
function getRewardPercent(amount: number): number {
  if (amount >= 5 && amount <= 500) return 1.5;
  if (amount >= 501 && amount <= 1000) return 1.6;
  if (amount >= 1001 && amount <= 2000) return 1.7;
  if (amount >= 2001 && amount <= 3000) return 1.8;
  if (amount >= 3001 && amount <= 5000) return 1.9;
  if (amount >= 5001) return 2.0;
  return 0;
}

export async function GET() {
  await connectDB();

  try {
    const activeStakes = await Stake.find({ status: "active" });

    for (const stake of activeStakes) {
      const user = await User.findById(stake.userId);
      if (!user) continue;

      const rewardPercent = getRewardPercent(stake.amount);
      if (rewardPercent === 0) continue; // invalid stake amount

      const reward = (stake.amount * rewardPercent) / 100;

      // ✅ Add only reward — NEVER principal
      user.balance += reward;
      stake.totalReward += reward;

      await user.save();
      await stake.save();
    }

    return NextResponse.json(
      { message: "🎉 Daily rewards distributed successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Reward distribution failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
