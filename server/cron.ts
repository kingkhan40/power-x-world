import axios from "axios";
import mongoose from "mongoose";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import { connectDB } from "@/lib/db";

const RPC_URL = process.env.BSC_RPC_URL!;
const DEPOSIT_WALLET = process.env.DEPOSIT_WALLET!.toLowerCase();

async function detectDeposits() {
  await connectDB();

  try {
    console.log("🔍 Checking blockchain for new deposits...");

    // Example: get last few transactions from Ankr RPC
    const { data } = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      method: "ankr_getTransactionsByAddress",
      params: { address: DEPOSIT_WALLET, pageSize: 10 },
      id: 1,
    });

    const txs = data.result?.transactions || [];
    for (const tx of txs) {
      const from = tx.from.toLowerCase();
      const to = tx.to.toLowerCase();
      const amount = parseFloat(tx.value) / 1e18;
      const txHash = tx.hash;

      if (to === DEPOSIT_WALLET && amount >= 5) {
        const existing = await Deposit.findOne({ txHash });
        if (existing) continue;

        const user = await User.findOne({ wallet: from });
        if (!user) continue;

        console.log(`💰 New deposit from ${from}: ${amount} USDT`);

        await Deposit.create({
          userId: user._id,
          wallet: from,
          amount,
          txHash,
          confirmed: true,
          chain: "BNB Smart Chain",
          token: "USDT (BEP20)",
        });

        user.wallet += amount;
        await user.save();
      }
    }

    console.log("✅ Deposit detection completed.");
  } catch (err: any) {
    console.error("❌ Deposit detection error:", err.message);
  } finally {
    await mongoose.connection.close();
  }
}

detectDeposits();
