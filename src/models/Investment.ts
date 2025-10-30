// Use default export
export default interface Investment {
  userId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: "active" | "completed" | "pending";
}
