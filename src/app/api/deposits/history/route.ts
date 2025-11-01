import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ✅ Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI!;

if (!mongoose.connection.readyState) {
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB (deposits route)");
} else {
  console.log("✅ Using cached MongoDB connection");
}

// ✅ Deposit Schema
const depositSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
    },
    wallet: { type: String },
    userId: { type: String },
  },
  { timestamps: true }
);

const Deposit =
  mongoose.models.Deposit || mongoose.model("Deposit", depositSchema);

// ✅ GET: Fetch deposit history
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const deposits = await Deposit.find(filter).sort({ createdAt: -1 });

    return NextResponse.json(deposits);
  } catch (error) {
    console.error("❌ Error fetching deposits:", error);
    return NextResponse.json(
      { error: "Failed to fetch deposit history" },
      { status: 500 }
    );
  }
}
