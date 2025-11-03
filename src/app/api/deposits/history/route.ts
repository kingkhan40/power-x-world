import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Deposit from "@/models/Deposit";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Fetch all deposits for this user
    const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(deposits, { status: 200 });
  } catch (error) {
    console.error("Error fetching deposit history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
