// models/User.ts
import mongoose, { Schema, Document, Types } from "mongoose";

/* -----------------------------------------
 * 🧩 Sub-Schemas & Interfaces
 * ----------------------------------------- */
export interface IInvestment {
  amount: number;
  date: Date;
}

export interface IUserSettings {
  usdtBalance?: number;
  selfBusiness?: number;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  twoFactorAuth: boolean;
}

/* -----------------------------------------
 * 🧠 Main User Interface
 * ----------------------------------------- */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  referralCode: string;
  referredBy?: Types.ObjectId | null;
  team?: string;
  wallet?: number;
  level?: number;
  teamMembers?: Types.ObjectId[];
  totalTeam?: number;
  activeUsers?: number;
  investments?: IInvestment[];
  walletAddress?: string;
  settings?: IUserSettings;
  profilePic?: string | null;

  // Business Fields
  usdtBalance?: number;
  selfBusiness?: number;
  directBusiness?: number;
  rewardBalance?: number;
  currentRewardLevel?: number;

  // Payments
  rewardPayment?: number;
  totalCommission?: number;
  otherPayments?: number;

  // Misc
  isVerified?: boolean;
  phone?: string;
  address?: string;
  createdAt?: Date;
}

/* -----------------------------------------
 * 🧩 User Schema Definition
 * ----------------------------------------- */
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["User", "Admin"], default: "User" },
    isActive: { type: Boolean, default: true },

    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

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

    settings: {
      usdtBalance: { type: Number, default: 0 },
      selfBusiness: { type: Number, default: 0 },
      notifications: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: true },
      },
      twoFactorAuth: { type: Boolean, default: false },
    },

    profilePic: { type: String, default: null },

    usdtBalance: { type: Number, default: 0 },
    selfBusiness: { type: Number, default: 0 },
    directBusiness: { type: Number, default: 0 },
    rewardBalance: { type: Number, default: 0 },
    currentRewardLevel: { type: Number, default: 1 },

    rewardPayment: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    otherPayments: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
  },
  { timestamps: true }
);

/* -----------------------------------------
 * ✅ Safe Export for Hot Reload
 * ----------------------------------------- */
export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
