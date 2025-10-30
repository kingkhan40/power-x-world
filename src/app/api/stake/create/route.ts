import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";   // ✅ absolute path
import User from "@/models/User";
import Stake from "@/models/Stake";     // ✅ fixed import

export async function POST(req: Request) {
  await connectDB();

  try {
    const { userId, amount, plan } = await req.json();

    // ✅ User check karo
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Balance check karo
    if (user.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    // ❌ Principal deduct kar do (staking = lock)
    user.balance -= amount;
    await user.save();

    // ✅ Naya stake create karo
    const stake = await Stake.create({
      userId,
      amount,
      plan,
      status: "active",
      totalReward: 0,
      startDate: new Date(),
    });

    return NextResponse.json(
      { message: "✅ Staking started successfully", stake },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating stake:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
