import mongoose, { Schema, models, model } from "mongoose";

export interface IInvestment {
  wallet: string;
  amount: number;
  dailyRate: number;
  durationDays: number;
  startAt: Date;
  earned: number;
  status: string;
  lockedAmount: number;
  meta?: Record<string, any>;
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    wallet: { type: String, required: true },
    amount: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    durationDays: { type: Number, default: 7 },
    startAt: { type: Date, default: Date.now },
    earned: { type: Number, default: 0 },
    status: { type: String, default: "active" },
    lockedAmount: { type: Number, required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

// 👇 Add this export
export const Investment =
  models.Investment || model<IInvestment>("Investment", InvestmentSchema);
