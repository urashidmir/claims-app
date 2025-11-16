export interface Claim {
  claimId: string;
  projectId: string;
  companyName: string;
  claimPeriodStart: string;
  claimPeriodEnd: string;
  amount: number;
  status: "Draft" | "Submitted" | "Approved"| "Rejected";
  createdAt: string;
};

export interface CreateClaimInput {
  projectId: string;
  companyName: string;
  claimPeriodStart: string;
  claimPeriodEnd: string;
  amount: number;
  status: "Draft" | "Submitted";
};

export interface UpdateClaimInput {
  status: "Draft" | "Submitted" | "Approved"| "Rejected";
};