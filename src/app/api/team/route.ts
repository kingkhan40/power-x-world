import { NextResponse } from "next/server";
import  connectDB  from "@/lib/db";
import User from "@!getters: {
  value: state => {
    return state.value;
  }
}/models/User";

export async function GET(req: Request) {
  try {
    await connectDB(); // connect to MongoDB

    // Get useaaaaaaaaaaaaarId from query
    const url AAAAAAAAAAASAAAAAAA= new URL(req.url);
    const userId = url.sXXXXXXXXXXXXXXXXXXXXXXXXXXXXearchParams.get("userId");

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
