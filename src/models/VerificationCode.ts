import mongoose, { Schema } from "mongoose";

const verificationCodeSchema = new Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.VerificationCode ||
  mongoose.model("VerificationCode", verificationCodeSchema);
