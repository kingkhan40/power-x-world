import mongoose, { Types, Document } from "mongoose";
const { Schema, model, models } = mongoose;

/* -----------------------------------------
 * 🧩 Sub-Schemas & Interfaces
 * ----------------------------------------- */
export interface IInvestment {
  amount: number;
  date: Date;
}

export interface IUserSettings {
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
  // ---- Core fields (renamed to match the new snippet) ----
  userName: string;
  userEmail: string;
  password: string;
  role: "User" | "Admin";
  isActive: boolean;

  // ---- Referral & Team ----
  referralCode: string;
  referredBy?: Types.ObjectId | null;
  team?: string;
  wallet?: number;
  level?: number;
  teamMembers?: Types.ObjectId[];
  totalTeam?: number;
  activeUsers?: number;

  // ---- Investments ----
  investments?: IInvestment[];

  // ---- Wallet & Crypto ----
  walletAddress?: string;
  usdtBalance?: number;
  selfBusiness?: number;
  directBusiness?: number;
  rewardBalance?: number;
  currentRewardLevel?: number;

  // ---- Payments ----
  rewardPayment?: number;
  totalCommission?: number;
  otherPayments?: number;

  // ---- Settings ----
  settings?: IUserSettings;

  // ---- Misc ----
  profilePic?: string;   // default "" (as per the new snippet)
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
    // ---- Core fields (renamed) ----
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, unique: true, required: true, lowercase: true },
    password: { type: String, required: true },

    role: { type: String, enum: ["User", "Admin"], default: "User" },
    isActive: { type: Boolean, default: true },

    // ---- Referral & Team ----
    referralCode: { type: String, unique: true, required: true },
    referredBy: { type: Schema.Types.ObjectId, ref: "User", default: null },

    team: { type: String, default: "admin" },
    wallet: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    teamMembers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    totalTeam: { type: Number, default: 0 },
    activeUsers: { type: Number, default: 0 },

    // ---- Investments ----
    investments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
      },
    ],

    // ---- Wallet & Crypto ----
    walletAddress: { type: String, default: "" },
    usdtBalance: { type: Number, default: 0 },
    selfBusiness: { type: Number, default: 0 },
    directBusiness: { type: Number, default: 0 },
    rewardBalance: { type: Number, default: 0 },
    currentRewardLevel: { type: Number, default: 1 },

    // ---- Payments ----
    rewardPayment: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    otherPayments: { type: Number, default: 0 },

    // ---- Settings (removed duplicated usdtBalance/selfBusiness) ----
    settings: {
      notifications: {
        push: { type: Boolean, default: true },
        email: { type: Boolean, default: false },
        sms: { type: Boolean, default: true },
      },
      twoFactorAuth: { type: Boolean, default: false },
    },

    // ---- Misc ----
    profilePic: { type: String, default: "" }, // <-- matches the new snippet
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
  models.User || model<IUser>("User", UserSchema);

export default User;