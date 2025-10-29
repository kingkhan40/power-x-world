import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
    }

    return NextResponse.json({
      success: true,
      balance: user.wallet ?? 0,
    });
  } catch (error) {
    console.error("Balance Fetch Error:", error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
