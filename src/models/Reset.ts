import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReset extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  createdAt: Date;
}

const ResetSchema = new Schema<IReset>(
  {
    email: { type: String, required: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default (mongoose.models.Reset as Model<IReset>) ||
  mongoose.model<IReset>("Reset", ResetSchema);
