import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStake extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  plan: string;
  status: "active" | "completed" | "cancelled";
  totalReward: number;
  startDate: Date;
  endDate?: Date;
}

const StakeSchema = new Schema<IStake>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    plan: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    totalReward: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true }
);

// ✅ Avoid model overwrite on hot reload (Next.js specific)
const Stake: Model<IStake> =
  mongoose.models.Stake || mongoose.model<IStake>("Stake", StakeSchema);

export default Stake;
