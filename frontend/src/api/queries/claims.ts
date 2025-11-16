import { apiRequest } from "../apiClient"
import type { Claim } from "../../types/claim";

export const fetchClaims = async (projectId?: string): Promise<Claim[]> => {
  const endpoint = projectId
    ? `/claims?projectId=${projectId}`
    : "/claims";

  return apiRequest<Claim[]>(endpoint);
};


export const fetchClaimById = async (claimId: string): Promise<Claim> => {
  return apiRequest<Claim>(`/claims/${claimId}`);
};
