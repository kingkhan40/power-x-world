import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { wallet } = await req.json();
    console.log("🧾 Incoming /api/check-transaction with wallet:", wallet);

    if (!wallet) {
      return NextResponse.json(
        { success: false, message: "Wallet address is required." },
        { status: 400 }
      );
    }

    const adminWallet = "0x6E84f52A49F290833928e651a86FF64e5851f422";
    const rpcUrl = process.env.BSC_RPC_URL;

    if (!rpcUrl) {
      console.error("❌ Missing BSC_RPC_URL in environment!");
      return NextResponse.json(
        { success: false, message: "RPC endpoint missing." },
        { status: 500 }
      );
    }

    // 📡 Ankr RPC (BSC) call
    const payload = {
      id: 1,
      jsonrpc: "2.0",
      method: "ankr_getTransfersByAddress",
      params: {
        address: wallet,
        direction: "outgoing",
        limit: 10,
      },
    };

    console.log("🔍 Calling Ankr RPC for wallet:", wallet);
    const { data } = await axios.post(rpcUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const transfers = data?.result?.transfers || [];
    console.log(`🔁 RPC returned ${transfers.length} transfers`);

    if (transfers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No deposit transaction found.",
      });
    }

    const latest = transfers.find(
      (tx: any) => tx.to === adminWallet
    );

    if (!latest) {
      return NextResponse.json({
        success: false,
        message: "No matching transfer to admin wallet found.",
      });
    }

    const txHash = latest?.hash;
    const amount = Number(latest?.value || 0);

    if (!txHash || amount <= 0) {
      console.warn("⚠️ Invalid transaction:", latest);
      return NextResponse.json({
        success: false,
        message: "Invalid transaction details.",
      });
    }

    const MIN_DEPOSIT = 5;
    if (amount < MIN_DEPOSIT) {
      return NextResponse.json({
        success: false,
        message: `Deposit must be at least ${MIN_DEPOSIT} USDT.`,
      });
    }

    const exists = await Deposit.findOne({ txHash });
    if (exists) {
      return NextResponse.json({
        success: false,
        message: "Transaction already confirmed.",
      });
    }

    const user = await User.findOne({ walletAddress: wallet });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    const deposit = await Deposit.create({
      userId: user._id,
      wallet,
      amount,
      txHash,
      token: "USDT (BEP20)",
      chain: "BNB Smart Chain",
      confirmed: true,
    });

    user.usdtBalance = (user.usdtBalance || 0) + amount;
    user.wallet = (user.wallet || 0) + amount;
    await user.save();

    const socketServerUrl = process.env.SOCKET_SERVER_URL || "https://powerxworld.uk";
    try {
      await axios.post(`${socketServerUrl}/emit`, {
        event: "balanceUpdated",
        payload: { wallet, newBalance: user.usdtBalance },
        wallet,
      });
    } catch (emitErr: any) {
      console.warn("⚠️ Socket emit failed:", emitErr.message || emitErr);
    }

    console.log(`✅ Deposit confirmed for ${wallet}, amount: ${amount}`);
    return NextResponse.json({
      success: true,
      message: "Deposit confirmed successfully.",
      txHash,
      amount,
      newBalance: user.usdtBalance,
      deposit,
    });
  } catch (error: any) {
    console.error("🚨 Error checking transaction:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error.",
        details: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
