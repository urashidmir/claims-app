import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../apiClient";
import type { Project, CreateProjectInput } from "../../types/project";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectInput) =>
      apiRequest<Project>("/projects", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
