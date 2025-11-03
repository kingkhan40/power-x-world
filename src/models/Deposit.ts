import mongoose, { Schema, models, model, Types } from "mongoose";

export interface IDeposit {
  userId: Types.ObjectId; // 👈 Added
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
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 👈 Added
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

export const Deposit =
  models.Deposit || model<IDeposit>("Deposit", DepositSchema);
