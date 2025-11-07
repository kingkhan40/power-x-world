import path from "path";
import { config } from "dotenv";

// ✅ Load environment variables manually from project root
const envPath = path.resolve(process.cwd(), ".env.local");
console.log("📦 Loading env from:", envPath);
config({ path: envPath });

// ✅ Debug check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI not found. Check .env.local file or path!");
  process.exit(1);
} else {
  console.log("✅ MONGODB_URI loaded successfully.");
}

/* ---------------------------------------------
 * 🧩 Imports (after env is loaded)
 * --------------------------------------------- */
import axios from "axios";
import mongoose from "mongoose";
import User from "@/models/User";
import Deposit from "@/models/Deposit";
import { connectDB } from "@/lib/db";

/* ---------------------------------------------
 * ⚙️ Constants
 * --------------------------------------------- */
const RPC_URL = process.env.BSC_RPC_URL!;
const DEPOSIT_WALLET = process.env.DEPOSIT_WALLET!.toLowerCase();

/* ---------------------------------------------
 * 💰 Deposit Detection Logic
 * --------------------------------------------- */
async function detectDeposits() {
  await connectDB();

  try {
    console.log("🔍 Checking blockchain for new deposits...");

    // ✅ Fetch recent transactions from Ankr RPC
    const { data } = await axios.post(RPC_URL, {
      jsonrpc: "2.0",
      method: "ankr_getTransactionsByAddress",
      params: { address: DEPOSIT_WALLET, pageSize: 10 },
      id: 1,
    });

    const txs = data.result?.transactions || [];
    console.log(`🔹 Found ${txs.length} transactions`);

    for (const tx of txs) {
      const from = tx.from?.toLowerCase();
      const to = tx.to?.toLowerCase();
      const amount = parseFloat(tx.value) / 1e18;
      const txHash = tx.hash;

      if (!from || !to || !txHash) continue;

      // ✅ Only track deposits to our main wallet
      if (to === DEPOSIT_WALLET && amount >= 5) {
        const existing = await Deposit.findOne({ txHash });
        if (existing) continue;

        const user = await User.findOne({ wallet: from });
        if (!user) continue;

        console.log(`💰 New deposit from ${from}: ${amount} USDT`);

        // ✅ Record deposit in DB
        await Deposit.create({
          userId: user._id,
          wallet: from,
          amount,
          txHash,
          confirmed: true,
          chain: "BNB Smart Chain",
          token: "USDT (BEP20)",
        });

        // ✅ Update user balance
        if (typeof user.walletBalance === "number") {
          user.walletBalance += amount;
        } else {
          user.walletBalance = amount;
        }
        await user.save();
      }
    }

    console.log("✅ Deposit detection completed.");
  } catch (err: any) {
    console.error("❌ Deposit detection error:", err.message);
  } finally {
    await mongoose.connection.close();
    console.log("🔒 MongoDB connection closed.");
  }
}

/* ---------------------------------------------
 * 🚀 Run the Cron Script
 * --------------------------------------------- */
detectDeposits();
