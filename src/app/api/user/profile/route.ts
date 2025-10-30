// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function GET(request: NextRequest) {
  await connectDB();
  const userId = request.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findById(userId).select("-password");
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user }, { status: 200 });
}

export async function POST(request: NextRequest) {
  await connectDB();
  const userId = request.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const name = formData.get("name") as string;
  const file = formData.get("profilePic") as File | null;

  let profilePicUrl: string | null = null;
  if (file && file.size > 0) {
    if (file.size > 200 * 1024) {
      return NextResponse.json({ error: "Image too large (max 200KB)" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    profilePicUrl = `data:${file.type};base64,${buffer.toString("base64")}`;
  }

  const update: any = {};
  if (name?.trim()) update.name = name.trim();
  if (profilePicUrl) update.profilePic = profilePicUrl;

  const updatedUser = await User.findByIdAndUpdate(userId, update, { new: true }).select("-password");
  if (!updatedUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json({ user: updatedUser }, { status: 200 });
}