import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Investment } from "@/models/Investment";

/**
 * ✅ Reward percent according to staking amount
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
    const activeInvestments = await Investment.find({ status: "active" });

    for (const inv of activeInvestments) {
      const user = await User.findOne({ wallet: inv.wallet });
      if (!user) continue;

      // ✅ Get correct reward percent based on stake amount
      const rewardPercent = getRewardPercent(inv.amount);
      if (rewardPercent === 0) continue;

      // ✅ Calculate reward for this cycle
      const reward = (inv.amount * rewardPercent) / 100;

      // ✅ Add reward to investment’s earned
      inv.earned += reward;

      // ✅ Check if total earned reached 3x of staked amount
      if (inv.earned >= inv.amount * 3) {
        // Credit reward (only reward, principal not returned)
        user.balance += inv.earned;
        await user.save();

        inv.status = "completed";
        await inv.save();

        console.log(`✅ ${inv.wallet} reached 3x — reward ${inv.earned} credited.`);
      } else {
        await inv.save();
      }
    }

    return NextResponse.json(
      { message: "🎉 Reward calculation executed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Reward update failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
