import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, amount }: { userId: string; amount: number } = await req.json();

    // 🔹 Validate request
    if (!userId || !amount) {
      return NextResponse.json(
        { success: false, message: "Missing userId or amount" },
        { status: 400 }
      );
    }

    // 🔹 Find user who is investing
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🔹 Record the investment
    user.investments.push({ amount, date: new Date() });
    await user.save();

    // 🔹 If user was referred by someone and invests ≥ $50
    if (amount >= 50 && user.referredBy) {
      const refUser = await User.findOne({ referralCode: user.referredBy });
      if (refUser) {
        // Increase referrer’s activeUsers count
        refUser.activeUsers += 1;

        // 🔹 Commission logic based on refUser.level
        let commissionRate = 0;
        switch (refUser.level) {
          case 1:
            commissionRate = 12;
            break;
          case 2:
            commissionRate = 5;
            break;
          case 3:
            commissionRate = 2;
            break;
          case 4:
            commissionRate = 2;
            break;
          default:
            commissionRate = 0;
        }

        // Calculate and add reward
        const reward = (amount * commissionRate) / 100;
        refUser.wallet += reward;

        // 🔹 Level-up logic: unlock next level
        if (refUser.activeUsers >= refUser.level) {
          refUser.level += 1;
        }

        await refUser.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: "Investment processed successfully",
    });
  } catch (error: unknown) {
    console.error("Investment Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
