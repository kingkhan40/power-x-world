import { NextRequest, NextResponse } from 'next/server';

let mockUser = {
  name: "John Doe",
  email: "john@mail.com",
  profilePic: null as string | null,
};

export async function GET() {
  return NextResponse.json({ success: true, ...mockUser });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const file = formData.get("profilePic") as File | null;

    if (name) mockUser.name = name;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      mockUser.profilePic = `data:${file.type};base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({ success: true, ...mockUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}