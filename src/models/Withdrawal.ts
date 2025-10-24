import mongoose, { Schema, models } from "mongoose";

const WithdrawalSchema = new Schema(
  {
    userWallet: { type: String, required: true },
    destination: { type: String, required: true },
    amount: { type: Number, required: true },
    token: { type: String, default: "USDT (BEP20)" },
    chain: { type: String, default: "BNB Smart Chain" },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Withdrawal =
  models.Withdrawal || mongoose.model("Withdrawal", WithdrawalSchema);
