import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const userId = request.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const user = await User.findById(userId).select('referredBy');
    if (!user || !user.referredBy) {
      return NextResponse.json({ sponsorId: null, name: 'No Referrer', profile: null });
    }

    const sponsor = await User.findById(user.referredBy).select('name profilePic userId');
    if (!sponsor) {
      return NextResponse.json({ sponsorId: user.referredBy, name: 'Deleted User', profile: null });
    }

    return NextResponse.json({
      sponsorId: sponsor.userId || sponsor._id.toString(),
      name: sponsor.name,
      profile: sponsor.profilePic || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}