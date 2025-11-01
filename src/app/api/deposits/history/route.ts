import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Deposit } from "@/models/Deposit";

export async function GET(req: Request) {
  await connectDB();
  const deposits = await Deposit.find().sort({ createdAt: -1 });
  return NextResponse.json(deposits);
}
