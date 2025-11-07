import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

// ========================
// GET User Profile
// ========================
export async function GET(request: NextRequest) {
  await connectDB();

  const userId = request.headers.get("x-user-id");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findById(userId).select("-password");
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user }, { status: 200 });
}

// ========================
// POST (Update Profile + Upload Image)
// ========================
export async function POST(request: NextRequest) {
  await connectDB();

  const userId = request.headers.get("x-user-id");
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const file = formData.get("profilePic") as File | null;

  let profilePicUrl: string | null = null;

  if (file && file.size > 0) {
    // ✅ Size limit: 512KB
    if (file.size > 512 * 1024) {
      return NextResponse.json(
        { error: "Image too large (maximum 512KB allowed)" },
        { status: 400 }
      );
    }

    // ✅ File type check
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    try {
      // ✅ Convert file to buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      const stream = Readable.from(buffer);

      // ✅ Upload to Cloudinary
      const result: any = await new Promise((resolve, reject) => {
        const upload = cloudinary.uploader.upload_stream(
          { folder: "profiles" },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );
        stream.pipe(upload);
      });

      profilePicUrl = result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }
  }

  const update: any = {};
  if (name?.trim()) update.name = name.trim();
  if (profilePicUrl) update.profilePic = profilePicUrl;

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
