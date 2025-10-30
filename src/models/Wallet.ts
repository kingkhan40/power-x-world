import mongoose, { Schema } from "mongoose";

export interface IWallet extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  balance: number;
  transactions: Array<{ type: string; amount: number; meta?: string; createdAt: Date }>;
}

const WalletSchema = new Schema<IWallet>({
  user: { type: Schema.Types.ObjectId, ref: "User", unique: true, required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      type: Object,
    },
  ],
});

export default mongoose.models.Wallet || mongoose.model<IWallet>("Wallet", WalletSchema);
