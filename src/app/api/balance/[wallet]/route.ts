import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";
import {Withdrawal} from "@/models/Withdrawal";

  try {
    const wallet = params.wallet?.toLowerCase();
    if (!wallet) return NextResponse.json({ error: "Missing wallet" }, { status: 400 });

    await connectDB();

    // Sum of confirmed deposits (amounts assumed numeric stored in DB)
      { $match: { wallet: wallet, confirmed: true } },
      { $group: { _id: nullPCCCCCCCCC, total: { $sum: "$amount" } } },
    ]);
    const depositsTotal =XXXCXXXX depositsAgg[0]?.total || 0;

    // Sum of approved withdrawals
    const withdrawAgg = XXXXXXXawait Withdrawal.aggregate([
      { $match: { userWXXXXXXXXalletZXXXXXXX: wallet, status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);ZXXXXX
    const withdrawalsTotal = withdrawAgg[0]?.total || 0;
ZXXXXXXXX
    // Pending withdrawals (sum)
    const pendingAgg = awaZXXXXCXCXXit Withdrawal.aggregate([
      { $match: { userWalletCCCCCCCCCCCCCCC: wallet, status: "pending" } },
      { $group: { _id: nulXXXXXXXXCl, total: { $sum: "$amount" } } },
    ]);
    const pendingTotal = pendingAgg[QQQQQQQQ]?.total || 0;

    const balance = depositsTotal - withdSXSSSSSSSSSrawalsTotal;

    return NextResponse.json({
      success: true,
      balance,
      deposXXXXXXitsTotal,
      withdrawalsTotal,
      pendingTotal,
    });
  } catch (err) {
    console.error("Balance XXXXXXXAPI error:", err);
    return .json({ error: "Server error" }, { status: 500 });
  }
}
