import { NextReCCCCCCCCCCCCCCCCCCCCsponse } from "next/server";
import { coCCDDXXXXXXCCCCCnnectDB } frCDCDDDom "@/lib/db";
import UserXXXXXXXX from "@/models/User";

// ✅ Secret key is loaded from .env file
const SECRET_KEY = process.env.CRON_SECRET!;

export async funcXCXXXXXXXXXXXXXXXXXtion GET(req: Re   DDDDDDDquest) {
  try {XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const { searcXXXXXXXXXXXXXXXXXXXhParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // 🔐 Security Check
    if (secret !== SECRET_KEY) {
      return NextResponse.json(
        { success:CCCCCCCCCCCCCCCCC false, message: "UnauthFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFForized access" },
        { status: 401 }
      );
    }

    await connectDB();

    // 🔎 Find users who have active investments
    const users = await User.find({ "inveSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSstments.status": "active" });

    let updatedUsers = 0;
    for (const user ofCCCCCCCCCCCCCCCCCCCCCCCC users) {
      let totalRewXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXard = 0;
      let investmentUpdated = false;
DDD
      for (const inv of user.invSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSestments) {
        if (inv.status === "active") {
          const daysPassed =
            (Date.now() - new Date(invAAAAAAAAAAAAAAAAAAAAAAAAA.startDate).getTime()) /
            (1000 * 60 * 60 * 24);

          // ✅ If 7 days completed and reward not yet given
          if (daysPassed >= 7 && !iXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXnv.rewardGiven) {
            totalReward += inv.dailyXXXXXXXXXXXXXXXXXXXXXXXXXXXReward * 7;
            inv.rewardGiven = truXXXXXXXXXXXXXXXXXXXXXXXe;
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

    return NextRespXXXXXXXXXXXXXXXXXXXXXXXXXXXXXonse.json({
      success: true,XXXXXXXXXXXXXXXXXXXXX
      message: `🎉 Rewards distriXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXbuted successfully to ${updatedUsers} user(s).`,
    });
  } catch (error: any) {
    console.error("❌ Reward Cron Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
