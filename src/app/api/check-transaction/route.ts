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

    // 📡 Alchemy API call (use BSC mainnet Alchemy endpoint)
    const alchemyUrl = `https://bnb-mainnet.g.alchemy.com/v2/${apiKey}`;
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

    // Try to parse amount from common fields
    // Some Alchemy transfer objects include 'value' (string) for native transfers
    // and 'erc20Token' or 'rawContract.value' for token transfers. We try a few fallbacks.
    let amount = 0;

    // prefer latest.value if present (string or numeric)
    if (latest?.value) {
      amount = Number(latest.value);
    } else if (latest?.rawContract?.value) {
      amount = Number(latest.rawContract.value);
    } else if (latest?.erc20Token?.amount) {
      // some alchemy responses give amount as string in erc20Token.amount
      amount = Number(latest.erc20Token.amount);
    } else if (latest?.delta) {
      amount = Number(latest.delta);
    }

    // If amount is still zero, try parsing metadata (some token transfers include tokenDecimal)
    // NOTE: This code assumes Alchemy returns token amounts in human-readable units in `value` or `erc20Token.amount`.
    if (!txHash || amount <= 0) {
      console.warn("⚠️ Invalid or zero transaction value from Alchemy:", latest);
      return NextResponse.json({
        success: false,
        message: "Invalid transaction details.",
      });
    }

    // === Minimum deposit check (changed to 5 USDT) ===
    // If your Alchemy returned amount is in smallest units (like wei / token decimals),
    // convert accordingly before this check. This implementation assumes `amount` is in human USDT units.
    const MIN_DEPOSIT = 5; // USD (USDT) minimum
    if (amount < MIN_DEPOSIT) {
      console.log(`❗ Deposit below minimum: ${amount} < ${MIN_DEPOSIT}`);
      return NextResponse.json({
        success: false,
        message: `Deposit must be at least ${MIN_DEPOSIT} USDT.`,
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
    user.wallet = (user.wallet || 0) + amount;
    await user.save();

    // 🔥 Real-time socket emit (via server /emit endpoint)
    const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:4004";
    try {
      await axios.post(`${socketServerUrl}/emit`, {
        event: "balanceUpdated",
        payload: {
          wallet,
          newBalance: user.usdtBalance,
        },
        // provide wallet too for room emit handling on server
        wallet,
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
