import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stake from "@/models/Stake";
import User from "@/models/User";

// get daily reward percent
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
  try {
    await connectDB();

    const activeStakes = await Stake.find({ isActive: true });

    for (const stake of activeStakes) {
      const rewardPercent = getRewardPercent(stake.amount);
      const dailyReward = (stake.amount * rewardPercent) / 100;

      stake.totalReward += dailyReward;

      // check 3x completion
      if (stake.totalReward >= stake.amount * 3) {
        stake.isActive = false;

        const user = await User.findById(stake.userId);
        if (user) {
          user.wallet.usdtBalance += stake.totalReward;
          await user.save();
        }
      }

      await stake.save();
    }

    return NextResponse.json({ message: "Daily rewards updated successfully ✅" });
  } catch (error) {
    console.error("Error updating rewards:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
