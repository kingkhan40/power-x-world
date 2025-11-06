// models/Withdrawal.ts
import mongoose, { Schema, models, model } from "mongoose";

export interface IWithdrawal {
  userWallet: string;
  destination: string;
  amount: number;
  token: string;
  chain: string;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  meta?: {
    fee?: number;
    txHash?: string;
    [key: string]: any;
  };
}

const WithdrawalSchema = new Schema<IWithdrawal>(
  {
    userWallet: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
    token: { type: String, default: "USDT" },
    chain: { type: String, default: "BEP20" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transactionId: { type: String, unique: true, sparse: true },
    meta: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Index for performance
WithdrawalSchema.index({ userWallet: 1, createdAt: -1 });
WithdrawalSchema.index({ status: 1 });

export const Withdrawal =
  models.Withdrawal || model<IWithdrawal>("Withdrawal", WithdrawalSchema);