// types/index.ts
import { ReactNode } from "react";
import { Types } from "mongoose";

// UI Types
export interface RewardPlan { /* ... */ }
export interface StatData { /* ... */ }

// USER MODEL - YEHI EXPORT HONA CHAHIYE
export interface IUser {
  _id: Types.ObjectId | string;
  name: string;
  email: string;
  password?: string;
  role: string;
  isActive: boolean;
  referralCode: string;
  referredBy: Types.ObjectId | string | null;
  team: string | null;
  wallet: number;
  level: number;
  teamMembers: Types.ObjectId[];
  totalTeam: number;
  activeUsers: number;
  walletAddress: string;
  settings: {
    phone?: string;
    address?: string;
    kycStatus?: string;
    [key: string]: any;
  };
  profilePic: string | null;
  usdtBalance: number;
  selfBusiness: number;
  directBusiness: number;
  rewardBalance: number;
  currentRewardLevel: number;
  rewardPayment: number;
  totalCommission: number;
  otherPayments: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// API RESPONSE
export interface ProfileApiResponse {
  user: {
    name: string;
    email: string;
    phone: string;
    address: string;
    joinDate: string;
    userId: string;
    kycStatus: string;
    accountType: string;
    totalInvestment: string;
    totalEarnings: string;
    activePlans: string;
    referralCode: string;
    profilePic: string | null;
    wallet?: number;
    usdtBalance?: number;
    selfBusiness?: number;
    directBusiness?: number;
    totalCommission?: number;
    rewardBalance?: number;
  };
  referrer: {
    name: string;
    sponsorId: string;
    profile: string | null;
  } | null;
}