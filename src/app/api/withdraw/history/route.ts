// app/withdraw/history/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Withdrawal } from '@/models/Withdrawal';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    const query: any = {};
    if (wallet) {
      query.userWallet = wallet;
    }

    const withdrawals = await Withdrawal.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const formatted = withdrawals.map((w: any) => {
      const date = new Date(w.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const time = new Date(w.createdAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      return {
        _id: w._id.toString(),
        transactionId: w.transactionId || w._id.toString().slice(-8).toUpperCase(),
        amount: Number(w.amount),
        method: `${w.token} (${w.chain})`,
        date,
        time,
        status: w.status.toLowerCase() as 'pending' | 'completed' | 'failed',
        wallet: w.destination,
        fee: w.meta?.fee ?? 0,
      };
    });

    return NextResponse.json(formatted, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal history' },
      { status: 500 }
    );
  }
}