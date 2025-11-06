import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Deposit from "@/models/Deposit";
import User from "@/models/User";
import axios from "axios";

/**
 * POST → Add a new deposit record (manual or system-detected)
 * GET → Fetch all confirmed deposits of a user
 */

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
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (amount < 50) {
      return NextResponse.json(
        { success: false, message: "Minimum deposit is 50 USDT." },
        { status: 400 }
      );
    }

    // === 1. CHECK FOR DUPLICATE TRANSACTION ===
    const existing = await Deposit.findOne({ txHash });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Transaction already exists.",
      });
    }

    // === 2. SAVE DEPOSIT (Unconfirmed initially) ===
    const deposit = await Deposit.create({
      userId,
      wallet,
      amount,
      token,
      txHash,
      chain,
      confirmed: false, // Confirmation via /check-transaction or admin
    });

    // === 3. FIND USER ===
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    // === 4. IMMEDIATE BALANCE UPDATE (optional, if auto-confirm system used) ===
    user.wallet = (user.wallet || 0) + amount;
    user.usdtBalance = (user.usdtBalance || 0) + amount;
    user.selfBusiness = (user.selfBusiness || 0) + amount;

    // === Add investment record ===
    user.investments = user.investments || [];
    user.investments.push({ amount, date: new Date() });

    await user.save();

    // === 5. REFERRAL COMMISSION SYSTEM (4-level deep) ===
    const commissionRates = [0.12, 0.05, 0.02, 0.02];
    let currentReferrerId = (user as any).referredBy;

    for (
      let level = 0;
      level < commissionRates.length && currentReferrerId;
      level++
    ) {
      const referrer = await User.findById(currentReferrerId);
      if (!referrer) break;

      // Initialize fields if missing
      (referrer as any).commissionedUsers = (referrer as any).commissionedUsers || [];
      (referrer as any).teamMembers = (referrer as any).teamMembers || [];

      const commissionKey = `${user._id.toString()}_L${level + 1}`;
      const isFirstCommission =
        !(referrer as any).commissionedUsers.includes(commissionKey);

      // === Calculate commission ===
      const commission = amount * commissionRates[level];
      referrer.wallet = (referrer.wallet || 0) + commission;

      if (isFirstCommission) {
        (referrer as any).commissionedUsers.push(commissionKey);

        // Add to team on Level 1 only
        if (level === 0 && !(referrer as any).teamMembers.includes(user._id)) {
          (referrer as any).teamMembers.push(user._id);
        }

        // Auto-upgrade level for direct referrals (max 4)
        if (level === 0 && (referrer as any).level < 4) {
          (referrer as any).level = ((referrer as any).level || 1) + 1;
        }
      }

      // Recalculate team stats (only Level 1)
      if (level === 0) {
        (referrer as any).totalTeam = (referrer as any).teamMembers.length;
        const activeCount = await User.countDocuments({
          _id: { $in: (referrer as any).teamMembers },
          "investments.amount": { $gte: 50 },
        });
        (referrer as any).activeUsers = activeCount;
      }

      await referrer.save();

      // Move to next upline
      currentReferrerId = (referrer as any).referredBy;
    }

    // === 6. Emit live socket update (if socket server is available) ===
    const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:4004";

    try {
      await axios.post(`${socketServerUrl}/emit`, {
        event: "balanceUpdated",
        payload: {
          wallet,
          newBalance: user.usdtBalance,
        },
        wallet, // included so socket-server can emit to room
      });
      console.log(`📡 Socket Emit → balanceUpdated (${wallet}) = ${user.usdtBalance}`);
    } catch (emitErr: any) {
      console.warn("⚠️ Socket emit failed:", emitErr?.message || emitErr);
    }

    // === RESPONSE ===
    return NextResponse.json({
      success: true,
      message: "Deposit saved successfully.",
      deposit,
      user: {
        wallet: user.wallet,
        usdtBalance: user.usdtBalance,
        selfBusiness: user.selfBusiness,
      },
    });
  } catch (err: any) {
    console.error("🚨 Deposit API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}

// === GET: Fetch confirmed deposits ===
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request." },
        { status: 401 }
      );
    }

    const deposits = await Deposit.find({
      userId,
      confirmed: true,
    })
      .select("amount token txHash createdAt")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, deposits });
  } catch (err: any) {
    console.error("🚨 GET Deposits Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch deposits." },
      { status: 500 }
    );
  }
}
