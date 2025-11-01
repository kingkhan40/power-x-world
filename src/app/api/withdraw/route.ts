import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, amount, walletAddress, status, method } = await req.json();

    // ✅ Validate input
    if (!userId || !amount || !walletAddress) {
      return NextResponse.json({
        success: false,
        message: "All fields are required (userId, amount, walletAddress)",
      });
    }

    // ✅ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Check sufficient balance
    if (user.wallet < amount) {
      return NextResponse.json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // ✅ Deduct balance
    user.wallet -= amount;
    await user.save();

    // ✅ Create withdrawal record
    const withdrawal = await Withdraw.create({
      userId,
      amount,
      walletAddress,
      status: status || "pending",
      method: method || "USDT-TRC20",
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request created successfully",
      withdrawal,
    });
  } catch (error: any) {
    console.error("Withdraw Error:", error?.message || error);
    return NextResponse.json({
      success: false,
      message:
        error?.message || "Server error while creating withdraw record",
    });
  }
}

// ✅ Optional: Fetch all withdrawals for a user
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "userId is required",
      });
    }

    const withdrawals = await Withdraw.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: withdrawals.length,
      withdrawals,
    });
  } catch (error: any) {
    console.error("Withdraw Fetch Error:", error?.message || error);
    return NextResponse.json({
      success: false,
      message:
        error?.message || "Server error while fetching withdrawal history",
    });
  }
}
