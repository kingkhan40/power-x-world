import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stake from "@/models/Stake";
import User from "@/models/User";

/** 
 * ✅ Daily reward updater (Cron Job)
 * Apply daily profit (1.5% – 2%) on all active stakes
 */
export async function GET() {
  try {
    await connectDB();

    // ✅ saare active stakes lao
    const activeStakes = await Stake.find({ status: "active" });

    if (!activeStakes.length) {
      return NextResponse.json({
        success: true,
        message: "⚠️ No active stakes found.",
      });
    }

    let updatedCount = 0;

    for (const stake of activeStakes) {
      // ✅ Reward percentage logic
      let rewardPercent = 0;
      const amount = stake.amount;

      if (amount >= 5 && amount <= 500) rewardPercent = 1.5;
      else if (amount <= 1000) rewardPercent = 1.6;
      else if (amount <= 2000) rewardPercent = 1.7;
      else if (amount <= 3000) rewardPercent = 1.8;
      else if (amount <= 5000) rewardPercent = 1.9;
      else rewardPercent = 2.0;

      // ✅ Calculate daily reward
      const dailyReward = (amount * rewardPercent) / 100;

      // ✅ Add to totalReward
      stake.totalReward += dailyReward;

      // ✅ Check if 3x reached
      const maxLimit = amount * 3;
      if (stake.totalReward >= maxLimit) {
        stake.status = "completed";

        // ✅ Update user wallet
        const user = await User.findById(stake.userId);
        if (user) {
          user.wallet += stake.totalReward;
          await user.save();
        }
      }

      await stake.save();
      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: "✅ Daily rewards processed successfully.",
      updatedStakes: updatedCount,
    });
  } catch (error) {
    console.error("❌ Cron Job Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
