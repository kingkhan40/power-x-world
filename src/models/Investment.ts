import mongoose, { Schema, models, model } from "mongoose";

export interface IInvestment {
  wallet: string;
  amount: number;          // staked amount (principal)
  earned: number;          // accumulated reward
  status: "active" | "completed";
  startAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    wallet: { type: String, required: true },
    amount: { type: Number, required: true },
    earned: { type: Number, default: 0 },
    status: { type: String, default: "active" },
    startAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Investment =
  models.Investment || model<IInvestment>("Investment", InvestmentSchema);
