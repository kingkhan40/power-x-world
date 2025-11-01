import mongoose, { Schema, models, model } from "mongoose";

export interface IWithdraw {
  userId: string;
  amount: number;
  walletAddress: string;
  status: "pending" | "completed" | "failed";
  method: string;
}

const WithdrawSchema = new Schema<IWithdraw>(
  {
    userId: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    walletAddress: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    method: { type: String, default: "USDT-TRC20" },
  },
  { timestamps: true }
);

// Ensure we don't redefine model on hot reload
export const Withdraw =
  models.Withdraw || model<IWithdraw>("Withdraw", WithdrawSchema);
