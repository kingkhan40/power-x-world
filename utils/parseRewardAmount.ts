// utils/parseRewardAmount.ts
export const parseRewardAmount = (amount: string): number => {
  if (amount === "N/A") return 0;
  return parseFloat(amount.replace("$", ""));
};