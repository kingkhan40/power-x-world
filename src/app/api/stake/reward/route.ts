import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Investment } from "@/models/Investment";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // 🔍 Get all active investments
    const activeInvestments = await Investment.find({ status: "active" });

    for (const inv of activeInvestments) {
      // ✅ Calculate total earned
      const threeXTarget = inv.amount * 3;

      if (inv.earned >= threeXTarget) {
        // 🏁 Mark investment complete
        inv.status = "completed";
        await inv.save();

        // 💰 Send reward (only profit, not principal)
        const rewardAmount = threeXTarget - inv.amount;

        const user = await User.findById(inv.user);
        if (user) {
          user.wallet = (user.wallet ?? 0) + rewardAmount;
          await user.save();
        }

        console.log(
          `✅ Reward completed for user: ${user?.email}, reward = ${rewardAmount}`
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reward check completed successfully.",
    });
  } catch (err: any) {
    console.error("Error in reward endpoint:", err.message);
    return NextResponse.json({ success: false, error: err.message });
  }
}
