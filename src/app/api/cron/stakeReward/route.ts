import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Investment from "@/models/Investment";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const investments = await Investment.find({ status: "active" });

    if (!investments.length) {
      return NextResponse.json({ message: "No active investments found." });
    }

    for (const inv of investments) {
      const user = await User.findById(inv.user);
      if (!user) continue;

      // 🧮 Calculate daily profit
      const dailyProfit = inv.amount * 0.02; // 2% per day (example)

      inv.earned += dailyProfit;

      // ✅ Check if 3x target reached
      if (inv.earned >= inv.amount * 3) {
        inv.status = "completed";

        // 💰 Add earned reward to user's wallet
        user.wallet = (user.wallet || 0) + inv.earned;

        await user.save();
        inv.released = true;
      }

      await inv.save();
    }

    return NextResponse.json({
      success: true,
      message: "Cron reward cycle executed successfully.",
    });
  } catch (error: any) {
    console.error("❌ Cron reward error:", error.message);
    return NextResponse.json(
      { success: false, message: "Cron reward failed." },
      { status: 500 }
    );
  }
}
