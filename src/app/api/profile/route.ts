// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Mock database (replace with your actual DB, e.g., Prisma, MongoDB)
let mockProfile = { name: "Admin User", email: "admin@example.com" };

export async function GET() {
  try {
    return NextResponse.json({ success: true, ...mockProfile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    // Validate input
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Update mock database (replace with actual DB update)
    if (name !== undefined) mockProfile.name = name;
    if (email !== undefined) mockProfile.email = email;

    return NextResponse.json({ success: true, ...mockProfile });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}