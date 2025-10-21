import mongoose, { Schema, Document, models } from "mongoose";

export interface ITransaction extends Document {
  wallet: string;
  amount: string;
  txHash: string;
  chain: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    wallet: { type: String, required: true },
    amount: { type: String, required: true },
    txHash: { type: String, required: true, unique: true },
    chain: { type: String, default: "unknown" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Transaction =
  models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
