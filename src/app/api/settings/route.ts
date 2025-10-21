// src/app/api/settings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await User.findOne({ email: "john.doe@example.com" });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, settings: user.settings, name: user.name, email: user.email });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { notifications, twoFactorAuth, profilePicture } = await req.json();

    if (!notifications && twoFactorAuth === undefined && !profilePicture) {
      return NextResponse.json({ success: false, error: "No valid settings provided" }, { status: 400 });
    }

    const updateData: any = {};
    if (notifications) updateData["settings.notifications"] = notifications;
    if (twoFactorAuth !== undefined) updateData["settings.twoFactorAuth"] = twoFactorAuth;
    if (profilePicture) updateData["settings.profilePicture"] = profilePicture;

    const user = await User.findOneAndUpdate(
      { email: "john.doe@example.com" },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, settings: user.settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}