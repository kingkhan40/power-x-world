import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// Convert uploaded file to Base64
async function fileToBase64(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "User ID missing in headers" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const profilePicFile = formData.get("profilePic") as File | null;

    let profilePicBase64: string | undefined = undefined;

    // Convert file to Base64 if present
    if (profilePicFile) {
      profilePicBase64 = await fileToBase64(profilePicFile);
    }

    // Prepare payload
    const updateData: any = {};
    if (name) updateData.name = name;
    if (profilePicBase64) updateData.profilePic = profilePicBase64;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully!",
        user: {
          userId: updatedUser._id.toString(),
          userName: updatedUser.name,
          userEmail: updatedUser.email,
          profilePic: updatedUser.profilePic,
          ...updatedUser._doc,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
