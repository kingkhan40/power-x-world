import { NextResponse } from "next/server";
import mongoose from "mongoose";

// 1️⃣ Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI!;

if (!mongoose.connection.readyState) {
  await mongoose.connect(MONGODB_URI);
}

// 2️⃣ Define a Mongoose schema (if not already defined)
const TransactionSchema = new mongoose.Schema(
  {
    transactionId: String,
    amount: Number,
    type: String,
    method: String,
    date: String,
    time: String,
    status: String,
    wallet: String,
  },
  { timestamps: true }
);

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);

// 3️⃣ GET route to fetch transactions
export async function GET() {
  try {
    const transactions = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json(transactions);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
