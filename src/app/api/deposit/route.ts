import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";
import { io } from "../../../../server/socket-server"; // ✅ added your socket instance

const ALCHEMY_URL =
  "https://bnb-mainnet.g.alchemy.com/v2/CLsc_8crKlQJL1wfRyVjQ";

const SOCKET_EMIT_URL =
  process.env.SOCKET_EMIT_URL || "http://localhost:3000/emit";

const ALCHEMY_URL =
  "https://bnb-mainnet.g.alchemy.com/v2/CLsc_8crKlQJL1wfRyVjQ";

const SOCKET_EMIT_URL =
  process.env.SOCKET_EMIT_URL || "http://localhost:4000/emit";

const ALCHEMY_URL =
  "https://bnb-mainnet.g.alchemy.com/v2/CLsc_8crKlQJL1wfRyVjQ";

const SOCKET_EMIT_URL =
  process.env.SOCKET_EMIT_URL || "http://localhost:4000/emit";

export async function POST(req: Request) {
  try {
    const { wallet, amount, token, txHash, chain } = await req.json();

    // 🛑 Validate required fields
    if (!wallet || !amount || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Step 1: Verify transaction using Alchemy
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

    // 🧾 Step 2: Check if transaction was successful
    if (!txReceipt || txReceipt.status !== "0x1") {
      return NextResponse.json(
        { error: "Transaction not confirmed or failed on blockchain" },
        { status: 400 }
      );
    }

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // 🪙 Step 3: Optional — Verify USDT BEP-20 contract address
=======
    // 🪙 Step 3: Optional — Verify that USDT BEP-20 contract address matches
>>>>>>> Stashed changes
=======
    // 🪙 Step 3: Optional — Verify that USDT BEP-20 contract address matches
>>>>>>> Stashed changes
    const isValidTo =
      txReceipt.to?.toLowerCase() ===
      "0x55d398326f99059ff775485246999027b3197955"; // USDT BEP20

    if (!isValidTo) {
      return NextResponse.json(
        { error: "Invalid or unsupported token transaction" },
        { status: 400 }
      );
    }

    // 💾 Step 4: Save verified deposit in DB
    await connectDB();

    const deposit = await Deposit.create({
      wallet,
      amount,
      token,
      txHash,
      chain,
      confirmed: true,
    });

<<<<<<< Updated upstream
<<<<<<< Updated upstream
    // 🔥 Step 5: Emit event via Socket.IO (Direct)
    io.emit(`deposit_${wallet.toLowerCase()}`, {
      amount,
      token: token || "USDT",
      txHash,
      confirmed: true,
    });

    // 🌍 Step 6: Also send HTTP POST to backend socket server (optional redundancy)
=======
    // 🔔 Step 5: Notify socket server (optional)
>>>>>>> Stashed changes
=======
    // 🔔 Step 5: Notify socket server (optional)
>>>>>>> Stashed changes
    try {
      await fetch(SOCKET_EMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
<<<<<<< Updated upstream
<<<<<<< Updated upstream
          event: `deposit_${wallet}`,
          payload: {
            wallet,
            amount,
            token,
            txHash,
            chain,
            confirmed: true,
=======
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          },
        }),
      });
    } catch (err) {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      console.warn("⚠ Socket emit HTTP fallback failed:", err);
    }

    // 🎉 Step 7: Return success
=======
=======
>>>>>>> Stashed changes
      console.warn("⚠ Socket emit failed:", err);
      // Not fatal — deposit is already saved
    }

    // 🎉 Step 6: Return success
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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