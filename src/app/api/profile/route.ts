import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Update DB here if needed
    return NextResponse.json({
      success: true,
      name: body.name ?? "Admin User",
      email: body.email ?? "admin@example.com",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update profile" }, { status: 500 });
  }
}
