import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const {
      wallet,
      amount,
      token = "USDT (BEP20)",
      txHash,
      chain = "BNB Smart Chain",
      userId,
    } = await req.json();

    // === VALIDATION ===
    if (!wallet || !amount || !txHash || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (amount < 50) {
      return NextResponse.json(
        { error: "Minimum deposit is 50 USDT" },
        { status: 400 }
      );
    }

    // === 1. SAVE DEPOSIT ===
    const deposit = await Deposit.create({
      user: userId,
      wallet,
      amount,
      token,
      txHash,
      chain,
      confirmed: true,
    });

    // === 2. UPDATE USER (INVESTMENT + WALLET + USDT BALANCE) ===
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Add to investments
    user.investments = user.investments || [];
    user.investments.push({ amount, date: new Date() });

    // Update wallet & usdtBalance
    user.wallet = (user.wallet || 0) + amount;
    user.usdtBalance = (user.usdtBalance || 0) + amount;

    // Update selfBusiness (if not already set)
    user.selfBusiness = (user.selfBusiness || 0) + amount;

    await user.save();

    // === 3. MULTI-LEVEL REFERRAL COMMISSION ===
    const commissionRates = [0.12, 0.05, 0.02, 0.02]; // L1:12%, L2:5%, L3:2%, L4:2%
    let currentReferrerId = user.referredBy;

    for (let level = 0; level < commissionRates.length && currentReferrerId; level++) {
      const referrer = await User.findById(currentReferrerId);
      if (!referrer) break;

      // Initialize arrays
      referrer.commissionedUsers = referrer.commissionedUsers || [];
      referrer.teamMembers = referrer.teamMembers || [];

      const commissionKey = `${user._id.toString()}_L${level + 1}`;
      const alreadyPaid = referrer.commissionedUsers.includes(commissionKey);

      if (!alreadyPaid) {
        const commission = amount * commissionRates[level];

        // Add commission to wallet
        referrer.wallet = (referrer.wallet || 0) + commission;

        // Add to team (only Level 1)
        if (level === 0 && !referrer.teamMembers.includes(user._id)) {
          referrer.teamMembers.push(user._id);
        }

        // Track to avoid duplicate
        referrer.commissionedUsers.push(commissionKey);

        // === RECALCULATE TEAM SIZE & ACTIVE USERS ===
        referrer.totalTeam = referrer.teamMembers.length;

        const activeCount = await User.countDocuments({
          _id: { $in: referrer.teamMembers },
          "investments.amount": { $gte: 50 },
        });
        referrer.activeUsers = activeCount;

        // === LEVEL UPGRADE (max 4) ===
        if (referrer.level < 4) {
          referrer.level += 1;
        }

        await referrer.save();
      }

      // Move up
      currentReferrerId = referrer.referredBy;
    }

    // === RESPONSE ===
    return NextResponse.json({
      success: true,
      verified: true,
      deposit,
      user: {
        wallet: user.wallet,
        usdtBalance: user.usdtBalance,
        selfBusiness: user.selfBusiness,
      },
    });
  } catch (err: any) {
    console.error("Deposit API Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}

// === GET: Fetch all confirmed deposits of user ===
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deposits = await Deposit.find({
      user: userId,
      confirmed: true,
    })
      .select("amount token txHash createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json(deposits);
  } catch (err: any) {
    console.error("GET Deposits Error:", err);
    return NextResponse.json({ error: "Failed to fetch deposits" }, { status: 500 });
  }
}