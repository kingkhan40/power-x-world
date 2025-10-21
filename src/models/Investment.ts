import mongoose, { Schema } from "mongoose";

export interface IInvestment extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  amount: number;
  status: "pending" | "active" | "completed";
  createdAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "active", "completed"], default: "active" },
  createdAt: { type: Date, default: () => new Date() },
});

export default mongoose.models.Investment || mongoose.model<IInvestment>("Investment", InvestmentSchema);
