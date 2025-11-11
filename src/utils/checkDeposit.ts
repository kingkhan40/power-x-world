import Deposit from "@/models/Deposit";
import { connectDB } from "@/lib/db";

const ALCHEMY_URL = process.env.ALCHEMY_URL as string;
const SOCKET_EMIT_URL = process.env.SOCKET_EMIT_URL as string;

export async function checkPendingDeposits() {
  await connectDB();

  const pending = await Deposit.find({ confirmed: false });

  for (const dep of pending) {
    try {
      const res = await fetch(ALCHEMY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getTransactionReceipt",
          params: [dep.txHash],
        }),
      });

      const json: any = await res.json();
      const receipt = json?.result;

      if (receipt?.status === "0x1") {
        await Deposit.findByIdAndUpdate(dep._id, { confirmed: true });

        // 🔥 Notify Socket Server
        await fetch(SOCKET_EMIT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "depositConfirmed",
            payload: { wallet: dep.wallet, amount: dep.amount },
          }),
        });

        console.log(`✅ Deposit confirmed for wallet: ${dep.wallet}`);
      }
    } catch (err) {
      console.error("Check deposit error:", err);
    }
  }
}
