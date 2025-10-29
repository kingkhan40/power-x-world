import mongoose, { Schema, models, model } from "mongoose";

// TypeScript interface for Deposit
export interface IDeposit {
  wallet: string;
  amount: number;
  token?: string;
  txHash?: string;
  chain?: string;
  confirmed?: boolean;
  meta?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

const DepositSchema = new Schema<IDeposit>(
  {
    wallet: { type: String, required: true },
    amount: { type: Number, required: true },
    token: { type: String },
    txHash: { type: String },
    chain: { type: String },
    confirmed: { type: Boolean, default: false },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// Export the model with proper typing
export const Deposit =
  models.Deposit || model<IDeposit>("Deposit", DepositSchema);