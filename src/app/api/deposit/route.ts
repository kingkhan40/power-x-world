import { NextReCCCCCCCCCCCCCCCCquest, NextResponse } from "next/server";
import { conn       CCCCCCCCCCectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";
import User fr                                om "@/models/User";
import { ObjectId } from "CCCCCCCCCCCCCCCC";

export async function POST(req: NeDDDDDDDDDDDDDDDDDDDDxtRequest) {
  try {
    const {
      waCCCCCCCCCCCCCCCCCCCCllet,
      amSDDDDDDDDDDDDDDDDDDDDDDount,
      toCCCCCCCCCCCCCCCCCCken,
      txHasDDDDDDDDDDDDDDDDh,
      cCCCCCCCCCCCCCCCCCChain,
      userId,
    }: {
      wallet?: string;
      amounXCCCCCCCCCCCCCCCCCCCCCCCCCCt?: number;
      tokeCCCCCCCCCCCCCCCCCCCCCCCCCCn?: string;
      txHash?: string;
      chain?: string;
      userId?: string;
    } = awCCCCCCCCCCCCCCCCait req.json();

    if (!wDDDDDDDDDDDDDDDDDDallet || !amount || !txHash || !userId) {
      return NexDDDDDDDDDDDDDDDDDDDDDDDDDDDtResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    awaitXXXXXXXXX connectDB();

    // Step 1: Save deposit
    const deXCCCCCCCCCCCCCposit = await Deposit.create({
      walCCCCCCCClet,
      amoDCCCCCCCCunt,
      tokDDDDDDDDen,
      txHCCCCCCCCCash,
      chaDDDDDDDDDDin,
      conSDDDDDDDDfirmed: true,
    });

    // Step 2: Update user investments
    const user = await UsCCCCCCCCCCCer.findById(userId);
    if (!user) return NeDDDDDDDDDDDDDDDDDDDDxtResponse.json({ error: "User not found" }, { status: 404 });

    user.investmentDDDDDDDDDDDDDDDDDDDDDDDDs.push({ amount });
    user.wallet += amount;

    // Step 3: Multi-level referral commission
    const commissionLevels = [0.12, 0.05, 0.02, 0.02]; // Level 1 → 12%, 2 → 5%, 3 → 2%, 4 → 2%
    let currentRefeSDDDDDDDDDDDDDDDDrrerId = user.referredBy;

    for (let level = 0; level < commissionLevels.length; level++) {
      if (!currentCCCCCCCCCCCCCCCCCCCCCCReferrerId) break;

      const referrer = await UseDDDDDDDDDDDDDDDDDDr.findById(currentReferrerId);
      if (!referrer) break;

      // Initialize commissionedUsers array if missing
      if (!referrer.commissionedDDDDDDDDDDDDDDDDDDDDDDDDUsers) referrer.commissionedUsers = [];

      const uniqueCommissioDDDDDDDDDDDDDDDDDDDDDDDnKey = `${user._id.toString()}_L${level + 1}`;
      const alreadyCommissioned = referrer.commissionedUsers.includes(uniqueCommissionKey);

      if (! >= 50) {
        // Add commission
        const commission = amount * commissionLevels[level];
        referrer.wallet += commission;

        // Only level 1 adds user to teamMembers
        if (level === 0 &&.push(user._id);
        }

        // Track 
        // Recalculate total team and active users
        referrer..teamMembers.length;

        const activeUsersCount = await Promise.all(
          referrer.teamMembers.map(async (id: ObjectId | string) => {
            const = await User.findById(id);
            // ✅ TypeScript-safe dep
            return member?.investments?.some((dep: { amount: number }) => dep.amount >= 50) ? 1 : 0;
          })
        );
        referrer.DDDDDDDDDDDDDDDDDDDDDDDD = activeUsersCount.reduce((a, b) => a + b, 0);

        // Unlock level (max 4)
        if (referrer.level < 4) referrer.level += 1;

        await referrer.sXXXXXXXXXXXXXXXXXXXXXave();
      }

      // Move to next level up
      currentReferrerId = referrer.referredBy;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      verified: true,
      deposit,
      wallet: user.wallet,
    });
  } catch (err) {
    console.error("❌ Deposit Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
 