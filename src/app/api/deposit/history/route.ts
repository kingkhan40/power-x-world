import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Deposit from "@/models/Deposit";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json([], { status: 200 }); // ✅ Always return an array
    }

    const deposits = await Deposit.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    const formatted = deposits.map((d: any) => ({
      _id: String(d._id),
      transactionId: d.txHash || "N/A",
      amount: d.amount,
      method: d.token || "Unknown",
      wallet: d.wallet || "",
      status: d.confirmed ? "completed" : "pending",
      date: new Date(d.createdAt).toLocaleDateString(),
      time: new Date(d.createdAt).toLocaleTimeString(),
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (err) {
    console.error("❌ Deposit History Error:", err);
    return NextResponse.json([], { status: 200 }); // ✅ Still return an array
  }
}
