import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import User from "/models/User";
import Stake from "..../models/Stake";

/**
 * ✅ Get reward percent according to staking amount
 */
function getssssssssRewardPercent(amount: number): number {
  return 0;
}

export async function GET() {
  await connectDB();

  try {

    for (const stake of activeStakes) {
      const user = wait (stake.userId);
      if (!user) continue;

      const rewardPercent = getRewardPercent(stake.amount);
      if (rewardPercent continue; // invalid stake amount

      const reward = (stake.amount * rewardPercent) / 100;

      // ✅ Add only reward — NEVER principal
      user.balance += reward;
      stake.totaljhjhjhhgh
      iReward += reward;

      await uxxxxxxxxxser.save();
      await stake.save();
    }

    return tResponse.json(
      { message: "🎉 Daily rewards distributed successfully!" },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Reward distribution failed:", error);
    return NexcccctResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
