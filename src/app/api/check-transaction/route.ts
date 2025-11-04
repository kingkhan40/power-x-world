import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import axios from "axios";

/**
 * ✅ POST /api/check-transaction
 * Verifies user's latest deposit via Alchemy,
 * updates balance, saves deposit, and triggers socket emit.
 */
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
    const apiKey = process.env.ALCHEMY_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing ALCHEMY_API_KEY in environment!");
      return NextResponse.json(
        { success: false, message: "Alchemy API key missing." },
        { status: 500 }
      );
    }

    // 📡 Alchemy API call (safer version)
    const alchemyUrl = `https://bnb-mainnet.g.alchemy.com/v2/CLsc_8crKlQJL1wfRyVjQ`;
    const payload = {
      id: 1,
      jsonrpc: "2.0",
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromAddress: wallet,
          toAddress: adminWallet,
          category: ["external", "token"],
          withMetadata: false,
          excludeZeroValue: true,
          maxCount: "0x3e8",
        },
      ],
    };

    console.log("🔍 Calling Alchemy for wallet:", wallet);
    const { data } = await axios.post(alchemyUrl, payload, {
      headers: { "Content-Type": "application/json" },
    });

    const transfers = data?.result?.transfers || [];
    console.log(`🔁 Alchemy returned ${transfers.length} transfers`);

    if (transfers.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No deposit transaction found.",
      });
    }

    // ✅ Get latest valid transfer
    const latest = transfers[0];
    const txHash = latest?.hash || null;
    const amount = Number(latest?.value || 0);

    if (!txHash || amount <= 0) {
      console.warn("⚠️ Invalid transaction data from Alchemy:", latest);
      return NextResponse.json({
        success: false,
        message: "Invalid transaction details.",
      });
    }

    // 🚫 Check duplicate deposit
    const exists = await Deposit.findOne({ txHash });
    if (exists) {
      console.log("♻️ Transaction already recorded:", txHash);
      return NextResponse.json({
        success: false,
        message: "Transaction already confirmed.",
      });
    }

    // ✅ Find user
    const user = await User.findOne({ walletAddress: wallet });
    if (!user) {
      console.warn("⚠️ No user found for wallet:", wallet);
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // 💾 Save deposit
    const deposit = await Deposit.create({
      userId: user._id,
      wallet,
      amount,
      txHash,
      token: "USDT (BEP20)",
      chain: "BNB Smart Chain",
      confirmed: true,
    });

    // 💰 Update user balances safely
    user.usdtBalance = (user.usdtBalance || 0) + amount;
    await user.save();

    // 🔥 Emit socket event
    const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:4004";
    try {
      await axios.post(`${socketServerUrl}/emit`, {
        event: "balanceUpdated",
        payload: {
          wallet,
          newBalance: user.usdtBalance,
        },
      });
      console.log(`📡 Socket emit success → balanceUpdated (${wallet}) = ${user.usdtBalance}`);
    } catch (emitErr: any) {
      console.warn("⚠️ Socket emit failed:", emitErr.message || emitErr);
    }

    // ✅ Done
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
