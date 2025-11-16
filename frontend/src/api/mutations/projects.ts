import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../apiClient";
import type { Project, CreateProjectInput, UpdateProjectInput } from "../../types/project";

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

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      data,
    }: {
      projectId: string;
      data: UpdateProjectInput;
    }) =>
      apiRequest<Project>(`/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    onSuccess: (updatedProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", updatedProject.projectId],
      });
    },
  });
};