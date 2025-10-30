import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Investment } from "@/models/Investment";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // 🔍 Find all completed but unreleased investments
    const completedInvestments = await Investment.find({
      status: "completed",
      released: { $ne: true },
    });

    if (completedInvestments.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No completed stakes pending reward release.",
      });
    }

    for (const inv of completedInvestments) {
      const user = await User.findById(inv.user);
      if (!user) continue;

      // 🪙 Add reward to wallet (only earned, not principal)
      user.wallet = (user.wallet || 0) + inv.earned;
      await user.save();

      // ✅ Mark investment as released
      inv.released = true;
      await inv.save();
    }

    return NextResponse.json({
      success: true,
      message: "All completed stake rewards released successfully.",
    });
  } catch (error: any) {
    console.error("❌ Reward release error:", error.message);
    return NextResponse.json(
      { success: false, message: "Failed to release rewards." },
      { status: 500 }
    );
  }
}
