import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const {
      wallet,
      amount,
      token,
      txHash,
      chain,
      userId,
    }: {
      wallet?: string;
      amount?: number;
      token?: string;
      txHash?: string;
      chain?: string;
      userId?: string;
    } = await req.json();

    if (!wallet || !amount || !txHash || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // Step 1: Save deposit
    const deposit = await Deposit.create({
      wallet,
      amount,
      token,
      txHash,
      chain,
      confirmed: true,
    });

    // Step 2: Update user investments
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    user.investments.push({ amount });
    user.wallet += amount;

    // Step 3: Multi-level referral commission
    const commissionLevels = [0.12, 0.05, 0.02, 0.02]; // Level 1 → 12%, 2 → 5%, 3 → 2%, 4 → 2%
    let currentReferrerId = user.referredBy;

    for (let level = 0; level < commissionLevels.length; level++) {
      if (!currentReferrerId) break;

      const referrer = await User.findById(currentReferrerId);
      if (!referrer) break;

      // Initialize commissionedUsers array if missing
      if (!referrer.commissionedUsers) referrer.commissionedUsers = [];

      const uniqueCommissionKey = `${user._id.toString()}_L${level + 1}`;
      const alreadyCommissioned = referrer.commissionedUsers.includes(uniqueCommissionKey);

      if (!alreadyCommissioned && amount >= 50) {
        // Add commission
        const commission = amount * commissionLevels[level];
        referrer.wallet += commission;

        // Only level 1 adds user to teamMembers
        if (level === 0 && !referrer.teamMembers.includes(user._id)) {
          referrer.teamMembers.push(user._id);
        }

        // Track commission
        referrer.commissionedUsers.push(uniqueCommissionKey);

        // Recalculate total team and active users
        referrer.totalTeam = referrer.teamMembers.length;

        const activeUsersCount = await Promise.all(
          referrer.teamMembers.map(async (id: ObjectId | string) => {
            const member = await User.findById(id);
            // ✅ TypeScript-safe dep
            return member?.investments?.some((dep: { amount: number }) => dep.amount >= 50) ? 1 : 0;
          })
        );
        referrer.activeUsers = activeUsersCount.reduce((a, b) => a + b, 0);

        // Unlock level (max 4)
        if (referrer.level < 4) referrer.level += 1;

        await referrer.save();
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
 