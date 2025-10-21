import mongoose, { Schema, models } from "mongoose";

const withdrawSchema = new Schema(
  {
    transactionId: String,
    amount: Number,
    method: String,
    date: String,
    time: String,
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "pending",
    },
    wallet: String,
  },
  { timestamps: true }
);

const Withdraw = models.Withdraw || mongoose.model("Withdraw", withdrawSchema);
export default Withdraw;
