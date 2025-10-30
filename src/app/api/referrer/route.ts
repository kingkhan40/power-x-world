// app/api/referrer/route.ts
import { MongoClient, ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  let client: MongoClient | null = null;

  try {
    client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db(); // Uses DB name from URI

    // === FEATURE 1: Return all users referred by `userId` ===
    if (userId) {
      if (!userId.trim()) {
        return NextResponse.json(
          { message: 'User ID is required' },
          { status: 400 }
        );
      }

      const referredBy = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;

      const referredUsers = await db
        .collection('users')
        .find({ referredBy })
        .toArray();

      return NextResponse.json({ referredUsers }, { status: 200 });
    }

    // === FEATURE 2: Hard-coded lookup for USR001234 (fallback sponsor) ===
    const targetUser = await db
      .collection('users')
      .findOne({ userId: 'USR001234' });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const sponsorId = targetUser.sponsorId || 'SPN002345';

    return NextResponse.json(
      { sponsorId },
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in /api/referrer:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } finally {
    await client?.close();
  }
}