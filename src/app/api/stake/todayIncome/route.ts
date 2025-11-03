import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Stake from "@/models/Stake";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });

    // Find user's active stakes
    const activeStakes = await Stake.find({ userId, isActive: true });

    // Sum today's rewards
    const todayIncome = activeStakes.reduce(
      (total, s) => total + (s.dailyReward || 0),
      0
    );

    return NextResponse.json({ todayIncome });
  } catch (error) {
    console.error("Today Income Fetch Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
