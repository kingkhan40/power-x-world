import mongoose, { Schema, models } from "mongoose";

const DepositSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    wallet: String,
    amount: Number,
    token: String,
    txHash: String,
    chain: String,
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Deposit = models.Deposit || mongoose.model("Deposit", DepositSchema);
export default Deposit;
