import mongoose, { Schema, models, model } from "mongoose";

export interface IDeposit {
  wallet: string;
  amount: number;
  token?: string;
  txHash?: string;
  chain?: string;
  confirmed?: boolean;
  meta?: Record<string, any>;
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

// 👇 Add this export
export const Deposit =
  models.Deposit || model<IDeposit>("Deposit", DepositSchema);
