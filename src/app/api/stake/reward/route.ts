import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Stake from "@/models/Stake";

export async function GET() {
  try {
    await connectDB();

    const activeStakes = await Stake.find({ isActive: true });

    for (const stake of activeStakes) {
      const totalTarget = stake.amount * 3; // 3x target
      const rewardTillNow = stake.dailyReward;

      // agar stake ka reward 3x ho gaya
      if (rewardTillNow >= totalTarget) {
        // stake complete
        stake.isActive = false;
        await stake.save();

        // user ko reward add kar do
        const user = await User.findById(stake.userId);
        if (user) {
          user.wallet.usdtBalance += rewardTillNow;
          await user.save();
        }
      }
    }

    return NextResponse.json({ message: "Reward check complete ✅" });
  } catch (error) {
    console.error("Reward Check Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
