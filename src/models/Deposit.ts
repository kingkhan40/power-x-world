import mongoose, { Schema, models, model } from "mongoose";

const DepositSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Wallet address from which deposit was sent
    wallet: {
      type: String,
      required: true,
      trim: true,
    },

    // Deposit amount (e.g., USDT)
    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Token name (optional)
    token: {
      type: String,
      default: "USDT (BEP20)",
    },

    // Blockchain transaction hash (unique)
    txHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // Blockchain network
    chain: {
      type: String,
      default: "BNB Smart Chain",
    },

    // Confirmation status (updated after blockchain verification)
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Auto adds createdAt & updatedAt
  }
);

// Index for faster queries
DepositSchema.index({ wallet: 1 });
DepositSchema.index({ txHash: 1 });

const Deposit = models.Deposit || model("Deposit", DepositSchema);
export default Deposit;
