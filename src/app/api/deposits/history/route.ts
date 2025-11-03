import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {Deposit} from "@/models/Deposit";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // ✅ Ensure userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId" }, { status: 400 });
    }

    // ✅ Fetch deposits belonging to this user
    const deposits = await Deposit.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 });

    if (!deposits || deposits.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(deposits, { status: 200 });
  } catch (error) {
    console.error("Error fetching deposits:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
