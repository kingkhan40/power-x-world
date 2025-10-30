// src/app/api/stake/get/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Investment } from "@/models/Investment";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId } = await req.json();
    if (!userId)
      return NextResponse.json({ message: "Invalid user" }, { status: 400 });

    const investments = await Investment.find({ wallet: userId }).sort({ createdAt: -1 });
    return NextResponse.json({ investments });
  } catch (error) {
    console.error("Fetch Stakes Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
