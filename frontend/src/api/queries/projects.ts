import { apiRequest } from "../apiClient"
import type { Project } from "../../types/project";

export const fetchProjects = async (): Promise<Project[]> => {
  return apiRequest<Project[]>("/projects");
};

export const fetchProject = async (projectId: string): Promise<Project> => {
  return apiRequest<Project>(`/projects/${projectId}`);
};