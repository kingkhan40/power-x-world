import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";

export async function POST(req: Request) {
  try {
    const { wallet, amount, token, txHash, chain } = await req.json();

    if (!wallet || !amount || !txHash)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    await connectDB();

    const deposit = await Deposit.create({ wallet, amount, token, txHash, chain });

    return NextResponse.json({ success: true, deposit });
  } catch (err) {
    console.error("Deposit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
