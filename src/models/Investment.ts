// src/models/Investment.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvestment extends Document {
  user: mongoose.Types.ObjectId; // <-- add this
  wallet: string;
  amount: number;
  lockedAmount: number;
  dailyRate: number;
  durationDays: number;
  startAt: Date;
  earned: number;
  status: "active" | "completed" | "pending";
  released?: boolean; // <-- add this as optional
}

const investmentSchema: Schema<IInvestment> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" }, // <-- add this
  wallet: { type: String, required: true },
  amount: { type: Number, required: true },
  lockedAmount: { type: Number, required: true },
  dailyRate: { type: Number, required: true },
  durationDays: { type: Number, required: true },
  startAt: { type: Date, default: Date.now },
  earned: { type: Number, default: 0 },
  status: { type: String, default: "active" },
  released: { type: Boolean, default: false }, // <-- add this
});

// Fix hot-reload model recompilation issue
const Investment: Model<IInvestment> =
  mongoose.models.Investment || mongoose.model<IInvestment>("Investment", investmentSchema);

export default Investment;
