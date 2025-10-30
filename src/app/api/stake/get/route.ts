import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface Investment {
  amount: number;
  isActive?: boolean;
  earnedBalance?: number;
}

interface UserType {
  name: string;
  email: string;
  wallet: string;
  usdtBalance: number;
  rewardBalance: number;
  investments: Investment[];
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const user = (await User.findById(userId)
      .select("name email wallet rewardBalance investments usdtBalance")
      .lean()) as UserType | null;

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Calculate total investment amount
    const totalInvestment = (user.investments || []).reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );

    return NextResponse.json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        wallet: user.wallet ?? "",
        usdtBalance: user.usdtBalance ?? 0,
        rewardBalance: user.rewardBalance ?? 0,
        totalInvestment,
        investments: user.investments || [],
      },
    });
  } catch (error: any) {
    console.error("❌ Error in /stake/get:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
