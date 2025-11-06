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

    // ✅ FIX: Minimum deposit now 5 USDT
    if (amount < 5) {
      return NextResponse.json(
        { success: false, message: "Minimum deposit is 5 USDT." },
        { status: 400 }
      );
    }

    // === 1. CHECK DUPLICATE TX ===
    const existing = await Deposit.findOne({ txHash });
    if (existing) {
      return NextResponse.json({
        success: false,
        message: "Transaction already exists.",
      });
    }

    // === 2. CREATE DEPOSIT (unconfirmed initially) ===
    const deposit = await Deposit.create({
      userId,
      wallet,
      amount,
      token,
      txHash,
      chain,
      confirmed: false,
    });

    // === 3. FIND USER ===
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found." });
    }

    // === 4. IMMEDIATE BALANCE UPDATE ===
    user.wallet = (user.wallet || 0) + amount;
    user.usdtBalance = (user.usdtBalance || 0) + amount;
    user.selfBusiness = (user.selfBusiness || 0) + amount;

    user.investments = user.investments || [];
    user.investments.push({ amount, date: new Date() });

    await user.save();

    // === 5. REFERRAL COMMISSION SYSTEM ===
    const commissionRates = [0.12, 0.05, 0.02, 0.02];
    let currentReferrerId = (user as any).referredBy;

    for (
      let level = 0;
      level < commissionRates.length && currentReferrerId;
      level++
    ) {
      const referrer = await User.findById(currentReferrerId);
      if (!referrer) break;

      (referrer as any).commissionedUsers =
        (referrer as any).commissionedUsers || [];
      (referrer as any).teamMembers = (referrer as any).teamMembers || [];

      const commissionKey = `${user._id.toString()}_L${level + 1}`;
      const isFirstCommission =
        !(referrer as any).commissionedUsers.includes(commissionKey);

      const commission = amount * commissionRates[level];
      referrer.wallet = (referrer.wallet || 0) + commission;

      if (isFirstCommission) {
        (referrer as any).commissionedUsers.push(commissionKey);

        if (level === 0 && !(referrer as any).teamMembers.includes(user._id)) {
          (referrer as any).teamMembers.push(user._id);
        }

        if (level === 0 && (referrer as any).level < 4) {
          (referrer as any).level = ((referrer as any).level || 1) + 1;
        }
      }

      if (level === 0) {
        (referrer as any).totalTeam = (referrer as any).teamMembers.length;

        const activeCount = await User.countDocuments({
          _id: { $in: (referrer as any).teamMembers },
          "investments.amount": { $gte: 5 },
        });

        (referrer as any).activeUsers = activeCount;
      }

      await referrer.save();
      currentReferrerId = (referrer as any).referredBy;
    }

    // === 6. SOCKET EMIT ===
    const socketServerUrl =
      process.env.SOCKET_SERVER_URL || "https://powerxworld.uk";

    try {
      await axios.post(`${socketServerUrl}/emit`, {
        event: "balanceUpdated",
        payload: {
          wallet,
          newBalance: user.usdtBalance,
        },
        wallet,
      });
      console.log(
        `📡 Socket Emit → balanceUpdated (${wallet}) = ${user.usdtBalance}`
      );
    } catch (emitErr: any) {
      console.warn("⚠️ Socket emit failed:", emitErr?.message || emitErr);
    }

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

/**
 * ✅ GET: Fetch confirmed deposits safely
 */
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

    const deposits =
      (await Deposit.find({ userId, confirmed: true })
        .select("amount token txHash createdAt")
        .sort({ createdAt: -1 })) || [];

    // ✅ FIX: Prevent crash when deposits is null/undefined
    const totalDeposit = Array.isArray(deposits)
      ? deposits.reduce((sum, d) => sum + (d.amount || 0), 0)
      : 0;

    return NextResponse.json({
      success: true,
      deposits,
      totalDeposit,
    });
  } catch (err: any) {
    console.error("🚨 GET Deposits Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch deposits.", error: err.message },
      { status: 500 }
    );
  }
}
