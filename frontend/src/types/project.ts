export interface Project {
  projectId: string;
  projectName: string;
  companyName: string;
  createdAt: string;
}

export interface CreateProjectInput {
  projectName: string;
  companyName: string;
}

export interface UpdateProjectInput {
  projectName: string;
}