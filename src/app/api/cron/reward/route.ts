import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// ✅ Secret key is loaded from .env file
const SECRET_KEY = process.env.CRON_SECRET!;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // 🔐 Security Check
    if (secret !== SECRET_KEY) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    await connectDB();

    // 🔎 Find users who have active investments
    const users = await User.find({ "investments.status": "active" });

    let updatedUsers = 0;
    for (const user of users) {
      let totalReward = 0;
      let investmentUpdated = false;

      for (const inv of user.investments) {
        if (inv.status === "active") {
          const daysPassed =
            (Date.now() - new Date(inv.startDate).getTime()) /
            (1000 * 60 * 60 * 24);

          // ✅ If 7 days completed and reward not yet given
          if (daysPassed >= 7 && !inv.rewardGiven) {
            totalReward += inv.dailyReward * 7;
            inv.rewardGiven = true;
            investmentUpdated = true;
          }
        }
      }

      // 💰 Add rewards to wallet if applicable
      if (investmentUpdated && totalReward > 0) {
        user.wallet = (user.wallet || 0) + totalReward;
        await user.save();
        updatedUsers++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `🎉 Rewards distributed successfully to ${updatedUsers} user(s).`,
    });
  } catch (error: any) {
    console.error("❌ Reward Cron Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
