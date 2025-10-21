import mongoose, { Schema, models } from "mongoose";

const DepositSchema = new Schema(
  {
    wallet: { type: String, required: true },
    amount: { type: String, required: true },
    txHash: { type: String, required: true },
    chain: { type: String, required: true },
  },
  { timestamps: true }
);

export const Deposit =
  models.Deposit || mongoose.model("Deposit", DepositSchema);
