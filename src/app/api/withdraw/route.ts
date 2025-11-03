// test commit

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { userId, email, amount, walletAddress, status, method } = await req.json();

    // ✅ Check required fields
    if ((!userId && !email) || !amount || !walletAddress) {
      return NextResponse.json({
        success: false,
        message: "All fields are required (userId/email, amount, walletAddress)",
      });
    }

    // ✅ Find user (by userId or email)
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ email });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Ensure balance is enough
    if (user.wallet < amount) {
      return NextResponse.json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // ✅ Calculate fee & amount to receive
    const fee = amount * 0.05;
    const amountAfterFee = amount - fee;

    // ✅ Deduct full amount from wallet
    user.wallet -= amount;
    await user.save();

    // ✅ Create withdraw record
    const withdraw = await Withdraw.create({
      userId: user._id,
      amount: amountAfterFee,
      walletAddress,
      fee,
      status: status || "pending",
      method: method || "USDT (TRC20)",
    });

    return NextResponse.json({
      success: true,
      message: "Withdrawal request created successfully",
      withdrawal: withdraw,
      newBalance: user.wallet,
    });
  } catch (error: any) {
    console.error("Withdraw Error:", error?.message || error);
    return NextResponse.json({
      success: false,
      message: error?.message || "Server error while creating withdraw record",
    });
  }
}

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
      message: error?.message || "Server error while fetching withdrawals",
    });
  }
}                                                                                              