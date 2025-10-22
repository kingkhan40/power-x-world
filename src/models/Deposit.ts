import mongoose, { Schema, models } from "mongoose";

const DepositSchema = new Schema(
  {
    wallet: { type: String, required: true },
    amount: { type: Number, required: true }, // should be Number, not String
    token: { type: String }, // optional if you want token symbol like USDT
    txHash: { type: String, required: true },
    chain: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ✅ Prevent model overwrite issues in Next.js
export const Deposit =
  models.Deposit || mongoose.model("Deposit", DepositSchema);