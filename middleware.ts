// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Example: Check for a token or session
  const token = request.cookies.get("auth_token")?.value;

  // Allow public routes
  if (request.nextUrl.pathname.startsWith("/api/settings") || request.nextUrl.pathname.startsWith("/api/settings/sse")) {
    return NextResponse.next();
  }

  // Require authentication for other protected routes
  if (!token) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Validate token (replace with your auth logic)
  // For example, verify JWT or session
  try {
    // Add your token validation logic here
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};