export function getRewardPercent(amount: number): number {
  if (amount >= 5 && amount <= 500) return 1.5;
  if (amount <= 1000) return 1.6;
  if (amount <= 2000) return 1.7;
  if (amount <= 3000) return 1.8;
  if (amount <= 5000) return 1.9;
  return 2.0;
}
