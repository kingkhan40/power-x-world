import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectDB(); // connect to MongoDB

    // Get userId from query
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Count users referred by this user
    // Make sure your User schema has a field like `referredBy`
    const totalTeam = await User.countDocuments({ referredBy: userId });

    return NextResponse.json({ totalTeam });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch team data" }, { status: 500 });
  }
}
