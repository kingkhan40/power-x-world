// app/api/total-users/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const total = await User.countDocuments();
    return NextResponse.json({ success: true, total });
  } catch (error) {
    console.error("Error fetching total users:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}