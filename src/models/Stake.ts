import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStake extends Document {
  userId: Types.ObjectId;
  amount: number;
  rewardPercent: number;
  totalReward: number;
  createdAt: Date;
  completedAt?: Date;
  status: "active" | "completed";
}

const StakeSchema = new Schema<IStake>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    rewardPercent: { type: Number, required: true },
    totalReward: { type: Number, default: 0 },
    completedAt: { type: Date },
    status: { type: String, enum: ["active", "completed"], default: "active" },
  },
  { timestamps: true }
);

export const Stake =
  mongoose.models.Stake || mongoose.model<IStake>("Stake", StakeSchema);

export default Stake;
