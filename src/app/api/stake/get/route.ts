import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { Investment } from "@/models/Investment";

export async function POST(req: Request) {
  await connectDB();

  try {
    const { wallet, amount } = await req.json();

    // ✅ Validate user
    const user = await User.findOne({ wallet });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Check existing active stake
    const existing = await Investment.findOne({ wallet, status: "active" });
    if (existing) {
      return NextResponse.json(
        { error: "You already have an active stake!" },
        { status: 400 }
      );
    }

    // ✅ Check balance
    if (user.balance < amount) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    // ✅ Deduct principal
    user.balance -= amount;
    await user.save();

    // ✅ Create new investment
    const investment = await Investment.create({
      wallet,
      amount,
      earned: 0,
      status: "active",
      startAt: new Date(),
    });

    return NextResponse.json(
      { message: "✅ Stake created successfully", investment },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating stake:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
