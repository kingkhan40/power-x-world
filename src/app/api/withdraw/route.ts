import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {  // ✅ Explicitly type the parameter
  try {
    await connectDB();

    const { email, walletAddress, amount } = await req.json() as {
      email: string;
      walletAddress: string;
      amount: number;
    };

    if (!email || !walletAddress || !amount) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    if (user.wallet < amount) {
      return NextResponse.json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // ✅ Update wallet balance
    user.wallet -= amount;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Withdrawal successful",
      newBalance: user.wallet,
    });
  } catch (error) {
    console.error("Withdraw API Error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
