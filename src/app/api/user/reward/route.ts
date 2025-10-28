import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();       

    const { userId } = await req.json();
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Reward conditions
    const selfBusiness = user.selfBusiness;
    const directBusiness = user.directBusiness;
    const currentRewardLevel = user.currentRewardLevel;

    let eligible = false;
    let rewardAmount = 0;

    // ✅ Reward 1
    if (currentRewardLevel === 1 && selfBusiness >= 500 && directBusiness >= 7000) {
      eligible = true;
      rewardAmount = 50;
    }

    // ✅ Reward 2
    else if (currentRewardLevel === 2 && selfBusiness >= 1000 && directBusiness >= 15000) {
      eligible = true;
      rewardAmount = 100;
    }

    // More rewards can be added here...

    if (!eligible) {
      return NextResponse.json({
        success: false,
        message: "You are not eligible for this reward yet.",
      });
    }

    // ✅ Reward Claim Logic
    user.rewardBalance += rewardAmount;
    user.usdtBalance += rewardAmount;
    user.currentRewardLevel += 1;

    await user.save();

    return NextResponse.json({
      success: true,
      message: `Reward of $${rewardAmount} claimed successfully!`,
      data: {
        usdtBalance: user.usdtBalance,
        rewardBalance: user.rewardBalance,
        currentRewardLevel: user.currentRewardLevel,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
