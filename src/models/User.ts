// src/models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

/* -----------------------------------------
 * 💰 Investment Interface
 * ----------------------------------------- */
export interface IInvestment {
  amount: number;
  date: Date;
}

/* -----------------------------------------
 * ⚙️ Settings Interface
 * ----------------------------------------- */
export interface IUserSettings {
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  twoFactorAuth: boolean;
  profilePicture?: string;
}

/* -----------------------------------------
 * 👤 User Interface
 * ----------------------------------------- */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  referralCode: string;
  referredBy?: string | null;
  team?: string;
  wallet?: number;
  level?: number;
  teamMembers?: Types.ObjectId[];
  totalTeam?: number;
  activeUsers?: number;
  investments?: IInvestment[];
  walletAddress?: string;
  settings?: IUserSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

/* -----------------------------------------
 * 🧩 User Schema
 * ----------------------------------------- */
const UserSchema = new Schema<IUser>(
  {
    // 🧱 Basic Info
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },

    // 🎯 Referral System
    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: String, default: null },

    // 👥 Team Structure
    team: { type: String, default: "admin" },
    wallet: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    totalTeam: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },

    // 💸 Investment History
    investments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],

    // 💼 Wallet
    walletAddress: { type: String, default: "" },

    // ⚙️ Settings
    settings: {
      notifications: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: true },
      },
      twoFactorAuth: { type: Boolean, default: true },
      profilePicture: { type: String, default: "" },
    },
  },
  { timestamps: true } // includes createdAt + updatedAt
);

/* -----------------------------------------
 * 🧠 Export Model (Hot Reload Safe)
 * ----------------------------------------- */
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
export default User;
