import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Investment } from "@/models/Investment";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "Missing userId or amount" },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Check wallet balance
    if (user.wallet < amount) {
      return NextResponse.json(
        { error: "Insufficient balance for staking!" },
        { status: 400 }
      );
    }

    // ✅ Deduct stake amount
    user.wallet -= amount;

    // ✅ Determine interest rate based on amount
    let rate = 0;
    if (amount >= 5 && amount <= 500) rate = 1.5;
    else if (amount >= 501 && amount <= 1000) rate = 1.6;
    else if (amount >= 1001 && amount <= 2000) rate = 1.7;
    else if (amount >= 2001 && amount <= 3000) rate = 1.8;
    else if (amount >= 3001 && amount <= 5000) rate = 1.9;
    else if (amount >= 5001) rate = 2.0;

    // ✅ Create investment record
    const stake = await Investment.create({
      user: user._id,
      amount,
      rate,
      totalEarned: 0,
      isCompleted: false,
      startDate: new Date(),
    });

    // ✅ Save updated wallet
    await user.save();

    return NextResponse.json(
      {
        message: "Stake created successfully!",
        wallet: user.wallet,
        stake,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating stake:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
