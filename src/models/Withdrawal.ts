import mongoose, { Schema, models, model } from "mongoose";

export interface IWithdrawal {
  userWallet: string;
  destination: string;
  amount: number;
  token?: string;
  chain?: string;
  status?: string;
  meta?: Record<string, any>;
}

const WithdrawalSchema = new Schema<IWithdrawal>(
  {
    userWallet: { type: String, required: true },
    destination: { type: String, required: true },
    amount: { type: Number, required: true },
    token: { type: String, default: "USDT (BEP20)" },
    chain: { type: String, default: "BNB Smart Chain" },
    status: { type: String, default: "pending" },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// 👇 Add this export
export const Withdrawal =
  models.Withdrawal || model<IWithdrawal>("Withdrawal", WithdrawalSchema);
