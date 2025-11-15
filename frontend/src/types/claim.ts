export interface Claim{
  claimId: string;
  projectId: string;
  companyName: string;
  claimPeriodStart: string;
  claimPeriodEnd: string;
  amount: number;
  status: "Draft" | "Submitted" | "Approved"| "Rejected";
  createdAt: string;
};