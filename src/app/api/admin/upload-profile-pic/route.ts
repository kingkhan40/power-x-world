import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import  User  from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("profilePicture") as File;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // Placeholder: Replace with Cloudinary or local storage logic
    const profilePictureUrl = `https://example.com/uploads/${file.name}`;

    const user = await User.findOneAndUpdate(
      { email: "john.doe@example.com" },
      { $set: { "settings.profilePicture": profilePictureUrl } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, profilePicture: user.settings.profilePicture });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    return NextResponse.json({ success: false, error: "Failed to upload" }, { status: 500 });
  }
}