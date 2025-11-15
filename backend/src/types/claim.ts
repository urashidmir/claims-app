export interface Claim {
  claimId: string;
  projectId: string;
  projectName: string;
  companyName: string;
  claimPeriodStart: string;
  claimPeriodEnd: string;
  amount: number;
  status: "Draft" | "Submitted" | "Approved" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

export interface CreateClaimInput {
  projectId: string;
  claimPeriodStart: string;
  claimPeriodEnd: string;
  amount: number;
}

export interface UpdateClaimInput {
  companyName?: string;
  claimPeriodStart?: string;
  claimPeriodEnd?: string;
  amount?: number;
  status?: "Draft" | "Submitted" | "Approved" | "Rejected";
}

export type CreateEnrichedClaimInput = CreateClaimInput & {
  projectName: string;
  companyName: string;
};
