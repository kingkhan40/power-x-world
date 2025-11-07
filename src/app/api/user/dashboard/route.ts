import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const user = await User.findById(userId)
      // YE LINE FIX KI GAYI HAI
      .select("level wallet totalCommission settings.usdtBalance settings.selfBusiness teamMembers")
      .populate({
        path: "teamMembers",
        select: "investments",
      });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // DEBUG (Optional - remove later)
    console.log("USER SETTINGS:", user.settings);

    const activeUsers = user.teamMembers.filter(
      (m: any) => (m.investments?.[0]?.amount ?? 0) >= 50
    ).length;

    const usdtBalance = user.settings?.usdtBalance ?? 0;
    const selfBusiness = user.settings?.selfBusiness ?? 0;
    const totalBusiness = usdtBalance + selfBusiness;

    return NextResponse.json({
      level: user.level ?? 1,
      totalTeam: user.teamMembers.length,
      activeUsers,
      totalBusiness,     // 1400
      usdtBalance,       // 700
      selfBusiness,      // 700
      wallet: user.wallet ?? 0,
      totalCommission: user.totalCommission ?? 0,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}  
