import { ProjectsRepository } from "./projectsRepository";
import { Project, CreateProjectInput } from "../../types/project";
import { ValidationError, NotFoundError } from "../../utils/errors";

export class ProjectsService {
  private projectsRepository: ProjectsRepository;

  constructor() {
    this.projectsRepository = new ProjectsRepository();
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const { projectName, companyName } = input;

    const trimmedProjectName = projectName?.trim();
    const trimmedCompanyName = companyName?.trim();

    if (!trimmedProjectName) {
      throw new ValidationError("Project Name is required");
    }

    if (!trimmedCompanyName) {
      throw new ValidationError("Company Name is required");
    }

    return this.projectsRepository.createProject({
      projectName: trimmedProjectName,
      companyName: trimmedCompanyName,
    });
  }

  async getProject(projectId: string): Promise<Project | null> {
    if (!projectId) {
      throw new ValidationError("ProjectId is required");
    }
    const project = await this.projectsRepository.getProject(projectId);
    if (!project) throw new NotFoundError("Project not found");
    return project;
  }

  async getProjects(): Promise<Project[]> {
    return this.projectsRepository.getProjects();
  }

  async updateProject(
    projectId: string,
    updates: Partial<Pick<Project, "projectName">>,
  ): Promise<Project> {
    if (!projectId) {
      throw new ValidationError("projectId is required");
    }

    const existing = await this.projectsRepository.getProject(projectId);
    if (!existing) {
      throw new NotFoundError("Project not found");
    }

    const cleanUpdates: Partial<Pick<Project, "projectName">> = {};

    if (updates.projectName !== undefined) {
      const trimmed = updates.projectName.trim();
      if (!trimmed) {
        throw new ValidationError("projectName cannot be empty");
      }
      cleanUpdates.projectName = trimmed;
    }

    if (Object.keys(cleanUpdates).length === 0) {
      throw new ValidationError("No valid fields provided for update");
    }

    return this.projectsRepository.updateProject(projectId, cleanUpdates);
  }
}
