// app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import  User  from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await User.findOne({ email: "john.doe@example.com" });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, name: user.name, email: user.email, settings: user.settings });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email } = await req.json();

    if (!name && !email) {
      return NextResponse.json({ success: false, error: "No valid profile data provided" }, { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const user = await User.findOneAndUpdate(
      { email: "john.doe@example.com" },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, name: user.name, email: user.email });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}