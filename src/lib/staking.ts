export function calculateDailyRate(amount: number): number {
  // mapping from your table:
  // 5$ to 500$     -> 1.5%
  // 501$ to 1000$  -> 1.6%
  // 1001$ to 2000$ -> 1.7%
  // 2001$ to 3000$ -> 1.8%
  // 3001$ to 5000$ -> 1.9%
  // 5001+          -> 2%
  if (amount >= 5001) return 2.0;
  if (amount >= 3001) return 1.9;
  if (amount >= 2001) return 1.8;
  if (amount >= 1001) return 1.7;
  if (amount >= 501) return 1.6;
  if (amount >= 5) return 1.5;
  return 1.5; // default floor
}

/** compute total earned if fullDays (fractional allowed) have passed
 *  dailyRate is percent e.g. 1.6
 */
export function earnedForPeriod(amount: number, dailyRate: number, days: number) {
  return (amount * (dailyRate / 100)) * days;
}
