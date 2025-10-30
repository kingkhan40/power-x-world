import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

interface Params {
  id: string;
}

export async function PATCH(
  req: Request,
  { params }: { params: Params }
) {
  try {
    await connectDB();

    // 🧩 Get active/inactive status from request body
    const { isActive }: { isActive: boolean } = await req.json();

    // 🔄 Update user status in MongoDB
    await User.findByIdAndUpdate(params.id, { isActive });

    // ✅ Return success response
    return NextResponse.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
