import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit"; // ✅ Correct (named import)
import { Withdrawal } from "@/models/Withdrawal"; // ✅ Same pattern expected
import { io as socketServer } from "../../../../server/socket-server";

export async function POST(req: Request) {
  try {
    const { userWallet, destination, amount } = await req.json();

    // ✅ Validate request fields
    if (!userWallet || !destination || !amount) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const wallet = userWallet.toLowerCase();
    const amt = Number(amount);

    if (isNaN(amt) || amt <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // ✅ Connect to DB
    await connectDB();

    // ✅ Calculate total confirmed deposits
    const depAgg = await Deposit.aggregate([
      { $match: { wallet: wallet, confirmed: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const depositsTotal = depAgg[0]?.total || 0;

    // ✅ Calculate total completed withdrawals
    const withdrawAgg = await Withdrawal.aggregate([
      { $match: { userWallet: wallet, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const withdrawalsTotal = withdrawAgg[0]?.total || 0;

    // ✅ Calculate available balance
    const available = depositsTotal - withdrawalsTotal;

    if (amt > available) {
      return NextResponse.json(
        { error: "Insufficient balance", available },
        { status: 400 }
      );
    }

    // ✅ Create withdrawal record (auto completed)
    const withdrawal = await Withdrawal.create({
      userWallet: wallet,
      destination: destination.toLowerCase(),
      amount: amt,
      token: "USDT (BEP20)",
      chain: "BNB Smart Chain",
      status: "completed",
    });

    // ✅ Calculate new balance
    const newBalance = available - amt;

    // ✅ Emit socket event for real-time UI update
    socketServer?.emit(`withdraw_${wallet}`, {
      id: withdrawal._id,
      status: "completed",
      amount: amt,
      destination,
      newBalance,
    });

    // ✅ Response
    return NextResponse.json({
      success: true,
      withdrawal,
      newBalance,
      message: "Withdrawal completed successfully!",
    });
  } catch (err) {
    console.error("Withdraw Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
