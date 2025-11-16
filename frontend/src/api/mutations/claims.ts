import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../apiClient";
import type {
  Claim,
  CreateClaimInput,
  UpdateClaimInput,
} from "../../types/claim";

export const useCreateClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClaimInput) =>
      apiRequest<Claim>("/claims", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    onSuccess: (createdClaim) => {
      queryClient.invalidateQueries({
        queryKey: ["claims", createdClaim.projectId],
      });
    },
  });
};

export const useUpdateClaim = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      claimId,
      data,
    }: {
      claimId: string;
      data: UpdateClaimInput;
    }) =>
      apiRequest<Claim>(`/claims/${claimId}`, {
        method: "PATCH", 
        body: JSON.stringify(data),
      }),

    onSuccess: (updatedClaim) => {
      queryClient.invalidateQueries({
        queryKey: ["claims", updatedClaim.projectId],
      });

      queryClient.invalidateQueries({
        queryKey: ["claim", updatedClaim.claimId],
      });
    },
  });
};
