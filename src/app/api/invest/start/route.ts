import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import  Deposit  from "@/models/Deposit";
import Investment from "@/models/Investment";
import { Withdrawal } from "@/models/Withdrawal";
import { calculateDailyRate } from "@/lib/staking";

const SOCKET_EMIT_URL = process.env.SOCKET_EMIT_URL || "https://socket.powerxworld.uk/emit";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { wallet, amount, token = "USDT (BEP20)", durationDays = 7 } = body;

    if (!wallet || !amount || amount <= 0)
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });

    const w = wallet.toLowerCase();
    const amt = Number(amount);

    await connectDB();

    // Calculate user's available balance = sum(deposits confirmed) - sum(withdrawals completed)
    const depAgg = await Deposit.aggregate([
      { $match: { wallet: w, confirmed: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const depositsTotal = depAgg[0]?.total || 0;

    const withAgg = await Withdrawal.aggregate([
      { $match: { userWallet: w, status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const withdrawalsTotal = withAgg[0]?.total || 0;

    const available = depositsTotal - withdrawalsTotal;

    if (amt > available) {
      return NextResponse.json({ error: "Insufficient balance", available }, { status: 400 });
    }

    // Create the investment (lock funds logically)
    const rate = calculateDailyRate(amt);

    const inv = await Investment.create({
      wallet: w,
      amount: amt,
      lockedAmount: amt,
      dailyRate: rate,
      durationDays,
      startAt: new Date(),
      earned: 0,
      status: "active"
    });

    // Emit socket event (HTTP fallback)
    try {
      await fetch(SOCKET_EMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: `investment_started_${w}`,
          payload: {
            id: inv._id,
            amount: amt,
            dailyRate: rate,
            durationDays,
            startAt: inv.startAt,
          },
        }),
      });
    } catch (err) {
      console.warn("socket emit fallback failed:", err);
    }

    return NextResponse.json({ success: true, investment: inv });
  } catch (err) {
    console.error("invest/start error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
