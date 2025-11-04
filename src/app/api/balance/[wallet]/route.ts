import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import  Deposit  from "@/models/Deposit";
import {Withdrawal} from "@/models/Withdrawal";

export async function GET(req: Request, { params }: { params: { wallet: string } }) {
  try {
    const wallet = params.wallet?.toLowerCase();
    if (!wallet) return NextResponse.json({ error: "Missing wallet" }, { status: 400 });

    await connectDB();

    // Sum of confirmed deposits (amounts assumed numeric stored in DB)
    const depositsAgg = await Deposit.aggregate([
      { $match: { wallet: wallet, confirmed: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const depositsTotal = depositsAgg[0]?.total || 0;

    // Sum of approved withdrawals
    const withdrawAgg = await Withdrawal.aggregate([
      { $match: { userWallet: wallet, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const withdrawalsTotal = withdrawAgg[0]?.total || 0;

    // Pending withdrawals (sum)
    const pendingAgg = await Withdrawal.aggregate([
      { $match: { userWallet: wallet, status: "pending" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const pendingTotal = pendingAgg[0]?.total || 0;

    const balance = depositsTotal - withdrawalsTotal;

    return NextResponse.json({
      success: true,
      balance,
      depositsTotal,
      withdrawalsTotal,
      pendingTotal,
    });
  } catch (err) {
    console.error("Balance API error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
