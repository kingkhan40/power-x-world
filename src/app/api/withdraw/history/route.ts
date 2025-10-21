import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Withdraw from "@/models/withdraw";

export async function GET() {
  try {
    await connectDB();
    const withdraws = await Withdraw.find().sort({ createdAt: -1 });
    return NextResponse.json(withdraws);
  } catch (error) {
    console.error("Error fetching withdraws:", error);
    return NextResponse.json(
      { message: "Error fetching withdraw history" },
      { status: 500 }
    );
  }
}
