import { NextResponse } from "next/server";

export async function POST() {
  // ✅ Terminal me dikhega ke API hit hua
  console.log("🚀 Logout API called");

  // Optional: clear cookie
  return NextResponse.json(
    { message: "Logout successful" },
    {
      status: 200,
      headers: {
        "Set-Cookie": "token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax",
      },
    }
  );
}
