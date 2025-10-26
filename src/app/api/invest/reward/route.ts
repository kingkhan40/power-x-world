import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Investment } from "@/models/Investment";
import { Deposit } from "@/models/Deposit";
import { earnedForPeriod } from "@/lib/staking";
import { io } from "@server/socket-server";
 // ✅ Imported socket instance

const SOCKET_EMIT_URL =
  process.env.SOCKET_EMIT_URL || "http://powerxworld.uk/emit";

// NOTE: This endpoint computes rewards, updates DB, emits socket updates, and finalizes investments.
export async function POST(req: Request) {
  try {
    await connectDB();

    // Find all active investments
    const actives = await Investment.find({ status: "active" }).lean();
    const responses: any[] = [];

    for (const inv of actives) {
      const now = new Date();
      const start = new Date(inv.startAt);
      const elapsedMs = now.getTime() - start.getTime();
      const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);
      const totalDurationDays = inv.durationDays;

      const clampedDays = Math.min(elapsedDays, totalDurationDays);
      const totalEarnedShouldBe = earnedForPeriod(
        inv.amount,
        inv.dailyRate,
        clampedDays
      );

      const delta = Math.max(0, totalEarnedShouldBe - (inv.earned || 0));
      const newEarned = (inv.earned || 0) + delta;
      const progress = Math.min(100, (clampedDays / totalDurationDays) * 100);

      const update: any = { earned: newEarned };
      let finalized = false;

      if (elapsedDays >= totalDurationDays) {
        update.status = "completed";
        update.endedAt = now;
        finalized = true;
      }

      // ✅ Update investment
      await Investment.updateOne({ _id: inv._id }, { $set: update });

      // ✅ If finalized, credit earned to user's deposits
      if (finalized) {
        await Deposit.create({
          wallet: inv.wallet,
          amount: newEarned,
          token: "USDT (BEP20)",
          txHash: `stake-earn-${inv._id}`,
          chain: "internal",
          confirmed: true,
        });
      }

      // ✅ Emit via HTTP fallback
      try {
        await fetch(SOCKET_EMIT_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: `investment_update_${inv.wallet}`,
            payload: { investmentId: inv._id, earned: newEarned, progress, finalized },
          }),
        });

        if (finalized) {
          await fetch(SOCKET_EMIT_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              event: `investment_completed_${inv.wallet}`,
              payload: { investmentId: inv._id, earned: newEarned, finalized: true },
            }),
          });
        }

        // ✅ Direct Socket emit (real-time balance update)
        io?.emit("rewardUpdated", {
          userId: inv.wallet, // wallet used as user identifier
          newBalance: newEarned,
        });
      } catch (emitErr) {
        console.warn("emit fallback failed:", emitErr);
      }

      responses.push({
        id: inv._id,
        wallet: inv.wallet,
        delta,
        newEarned,
        progress,
        finalized,
      });
    }

    return NextResponse.json({ success: true, processed: responses });
  } catch (err) {
    console.error("invest/reward error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
