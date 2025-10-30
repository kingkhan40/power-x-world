import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Investment } from "@/models/Investment";

export async function GET() {
  try {
    await connectDB();

    const activeInvestments = await Investment.find({ status: "active" });

    for (const inv of activeInvestments) {
      let percent = 0;

      // 🎯 Rate by investment amount
      if (inv.amount >= 5 && inv.amount <= 500) percent = 1.5;
      else if (inv.amount <= 1000) percent = 1.6;
      else if (inv.amount <= 2000) percent = 1.7;
      else if (inv.amount <= 3000) percent = 1.8;
      else if (inv.amount <= 5000) percent = 1.9;
      else if (inv.amount > 5000) percent = 2;

      // 💰 Daily earning 
      const dailyEarning = (inv.amount * percent) / 100;
      inv.earned += dailyEarning;

      // 🧮 Check for 3× completion
      if (inv.earned >= inv.amount * 3) {
        inv.status = "completed";
      }

      await inv.save();
    }

    return NextResponse.json({
      success: true,
      message: "Staking rewards updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating staking:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
}
