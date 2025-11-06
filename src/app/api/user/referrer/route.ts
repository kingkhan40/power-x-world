import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(userId).select('referredBy');
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    if (!user.referredBy) {
      return NextResponse.json({
        sponsorId: null,
        name: 'Admin',
        profile: null,
      });
    }

    const sponsor = await User.findById(user.referredBy).select('name profilePic');
    if (!sponsor) {
      return NextResponse.json({
        sponsorId: user.referredBy,
        name: 'Unknown User',
        profile: null,
      });
    }

    return NextResponse.json({
      sponsorId: user.referredBy,
      name: sponsor.name,
      profile: sponsor.profilePic || null,
    });
  } catch (error) {
    console.error('Referrer API Error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}