// models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInvestment {
  amount: number;
  date: Date;
}

export interface IUser extends Document {
  name?: string;
  email?: string;
  password?: string;
  referralCode?: string;
  referredBy?: string | null;
  team?: string;
  wallet?: number;
  level?: number;
  teamMembers?: Types.ObjectId[];
  totalTeam?: number;
  activeUsers?: number;
  investments?: IInvestment[];
  walletAddress?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define schema
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: String, default: null },
    team: { type: String, default: "admin" },
    wallet: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    totalTeam: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },
    investments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    walletAddress: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Use existing model if it already exists (for hot reload safety)
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
