import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IInvestment extends Document {
  userId: string;
  amount: number;
  plan: string;
  startDate: Date;
  endDate: Date;
  reward: number;
  status: 'active' | 'completed';
}

const InvestmentSchema: Schema<IInvestment> = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  plan: { type: String, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  reward: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'completed'], default: 'active' }
});

const Investment: Model<IInvestment> = mongoose.models.Investment || mongoose.model<IInvestment>('Investment', InvestmentSchema);

export default Investment;
