import { NextResponse } from "next/server";

// Example static data (replace with MongoDB later)
export async function GET() {
  try {
    const data = {
      success: true,
      name: "Admin User",
      email: "admin@example.com",
      settings: {
        notifications: { push: true, email: false, sms: true },
        twoFactorAuth: true,
        profilePicture: "",
      },
    };
    return NextResponse.json(data);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // Save to MongoDB here if needed
    return NextResponse.json({
      success: true,
      settings: body,
    });
  } catch (error) {
    console.error("Settings POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}