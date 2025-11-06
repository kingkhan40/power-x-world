// ✅ path: src/app/api/withdraw/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Withdraw } from "@/models/Withdraw";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Extract userId from query params (coming from frontend)
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // Build query based on userId
    const query: any = {};
    if (userId) {
      query.userId = userId;
    }

    const withdrawals = await Withdraw.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Format output for frontend display
    const formatted = withdrawals.map((w: any) => ({
      _id: w._id.toString(),
      amount: w.amount,
      status: w.status,
      method: w.method,
      walletAddress: w.walletAddress,
      createdAt: new Date(w.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error: any) {
    console.error("Withdraw History Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch withdrawal history" },
      { status: 500 }
    );
  }
}
