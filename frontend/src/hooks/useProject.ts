import { useQuery } from "@tanstack/react-query";
import { fetchProject } from "../api/queries/projects";

export const useProject = (projectId?: string | null) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: !!projectId,
  });
};
