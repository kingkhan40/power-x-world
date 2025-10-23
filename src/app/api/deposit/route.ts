import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";
import { io } from "../../../../server/socket-server";

const ALCHEMY_URL =
  "https://bnb-mainnet.g.alchemy.com/v2/CLsc_8crKlQJL1wfRyVjQ";

const SOCKET_EMIT_URL =
  process.env.SOCKET_EMIT_URL || "http://localhost:4000/emit";

export async function POST(req: Request) {
  try {
    const { wallet, amount, token, txHash, chain } = await req.json();

    if (!wallet || !amount || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const verifyTx = await fetch(ALCHEMY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "eth_getTransactionReceipt",
        params: [txHash],
      }),
    });

    const result = await verifyTx.json();
    const txReceipt = result.result;

    if (!txReceipt || txReceipt.status !== "0x1") {
      return NextResponse.json(
        { error: "Transaction not confirmed or failed on blockchain" },
        { status: 400 }
      );
    }

    const isValidTo =
      txReceipt.to?.toLowerCase() ===
      "0x55d398326f99059ff775485246999027b3197955"; // ✅ USDT BEP20

    if (!isValidTo) {
      return NextResponse.json(
        { error: "Invalid or unsupported token transaction" },
        { status: 400 }
      );
    }

    await connectDB();

    const deposit = await Deposit.create({
      wallet,
      amount,
      token,
      txHash,
      chain,
      confirmed: true,
    });

    io.emit(`deposit_${wallet.toLowerCase()}`, {
      amount,
      token: token || "USDT",
      txHash,
      confirmed: true,
    });

    try {
      await fetch(SOCKET_EMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "depositConfirmed",
          payload: {
            id: deposit._id,
            wallet: deposit.wallet,
            amount: deposit.amount,
            token: deposit.token,
            chain: deposit.chain,
            txHash: deposit.txHash,
            confirmed: deposit.confirmed,
            createdAt: deposit.createdAt,
          },
        }),
      });
    } catch (err) {
      console.warn("⚠ Socket emit HTTP fallback failed:", err);
    }

    return NextResponse.json({
      success: true,
      verified: true,
      deposit,
    });
  } catch (err) {
    console.error("❌ Deposit Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
