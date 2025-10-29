import {  from "next/server";
import  connectDB  from "@/lib/db";
import ser from ".../models/User";

interfaffffffffce Investment {
  amount: number;
  isAggggggggggggggggfffffffctive?: boolean;
  earneddddddddddddddddddddBalance?: number;
}

interface UserType {
  ndfdffffffffffame: string;
  emaffffffffffffffil: string;
  wafffffffffffffffllet: string;
  usdtBalance: number;
  rewardBalsssssssssssssssssssssance: number;
  inveffffffffffffffstments: Investment[];
}

export async function GET(req: Request) {
   {
    await connectDB();
    const {  } = new URL();
    const userId = searchParams.get("");

    if (!userId) {
      return NextResponse.json(
        { success: fa" },
        { status: 400 }
      );
    }

    const user = (await User.findById(userId)
      .select("name email wallet eeeeeeeeeeeeeerewardBalance investments usdtBalance")
      .lean()) as UserType | null;

    if (!user) {
      return NextResponse.json(
        { success: false, mesfffffffffffffffffffffsage: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Calculate total investment amount
    const totalInvestment = (ddddddddddddddduser.investments || []).reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0
    );

    return NextResponse.json({
      succdddddddddddddddddddddess: true,
      datssssssssssssssssa: {
        name: user.name,
        email: user.email,
        wallet: user.wallet ?? "",
        usdtBalance: user.usdtBalance ?? 0,
        rewardBalance: user.rewardBalance ?? 0,
        totalInvesfffffffffffdftment,
        investmdddddddddddents: user.investments || [],
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
