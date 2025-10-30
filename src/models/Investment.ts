import mongoose, { Schema, models, model } from "mongoose";

export interface IInvestment {
  user: mongoose.Types.ObjectId;       // 🔗 Linked to User
  amount: number;                      // Staked amount
  rate: number;                        // Interest rate (%)
  totalEarned: number;                 // Total earned so far
  isCompleted: boolean;                // Whether staking has reached 3x
  startDate: Date;                     // When staking started
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    rate: { type: Number, required: true },
    totalEarned: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    startDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Investment =
  models.Investment || model<IInvestment>("Investment", InvestmentSchema);
