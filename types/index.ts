// types/index.ts
import { ReactNode } from "react";

export interface RewardPlan {
  id: number;
  name: string;
  selfBusiness: string;
  directBusiness: string;
  rewardAmount: string;
  color: string;
  icon: ReactNode;
  image: string;
  achieved: boolean;
}

export interface StatData {
  id: number;
  value: string;
  label: string;
  icon: ReactNode;
  gradient: string;
  textColor: string;
}