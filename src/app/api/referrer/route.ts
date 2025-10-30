import { MongoClient } from 'mongodb';

export async function GET() {
  try {
    // Connect to MongoDB using env variable
    const client = await MongoClient.connect(process.env.MONGODB_URI!);
    const db = client.db(); // uses the database specified in URI

    // Fetch user by ID
    const user = await db.collection('users').findOne({ userId: 'USR001234' });

    if (!user) {
      await client.close();
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    await client.close();

    return new Response(JSON.stringify({ sponsorId: user.sponsorId || 'SPN002345' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in /api/referrer:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch sponsor ID' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
