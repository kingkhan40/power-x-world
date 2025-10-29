import { NextRequest, NextResponse } from 'next';

// Mock database (replace with your actual vdsdsdsddfr: "admin@example.com" };

export async function GET() {
  try {
    return NextResponse.json({ success: true, ...mockProfile });
  } catch 
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

        { status: 400 }
      );
    }
    if (name !== undefined) .name = name;
    if (email !== uo update profile' },
      { status: 500 }
    );
  }
}