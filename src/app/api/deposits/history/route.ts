import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Deposit from "@/models/Deposit";

// ✅ GET: Fetch deposit history
export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Extract userId from query params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Validation
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // ✅ Fetch all deposits for this user
    const deposits = await Deposit.find({ userId }).sort({ createdAt: -1 });

    // ✅ Return deposits
    return NextResponse.json(deposits, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error fetching deposits:", error);
    return NextResponse.json(
      { error: "Failed to fetch deposit history", details: error.message },
      { status: 500 }
    );
  }
}
   