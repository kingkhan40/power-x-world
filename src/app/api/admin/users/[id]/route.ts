import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

// ✅ Correct signature for dynamic route
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } } // destructure here
) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Get new active/inactive status from request body
    const { isActive }: { isActive: boolean } = await req.json();

    // Update user in MongoDB
    await User.findByIdAndUpdate(params.id, { isActive });

    // Return success
    return NextResponse.json({ message: "User status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
