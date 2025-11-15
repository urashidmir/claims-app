import crypto from "crypto";
import { Project, CreateProjectInput } from "../../types/project";
import { performDynamoDbOperation } from "../../utils/dynamoUtils";

export class ProjectsRepository {
  private tableName: string;

  constructor() {
    this.tableName = process.env.PROJECTS_TABLE || "ProjectsTable";
  }

  async createProject(input: CreateProjectInput): Promise<Project> {
    const now = new Date().toISOString();

    const item: Project = {
      projectId: crypto.randomUUID(),
      projectName: input.projectName,
      companyName: input.companyName,
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: this.tableName,
      Item: item,
    };

    await performDynamoDbOperation(params, "put");
    return item;
  }

  async getProject(projectId: string): Promise<Project | null> {
    const params = {
      TableName: this.tableName,
      Key: { projectId },
    };

    const result = await performDynamoDbOperation(params, "get");

    return (result as Project) || null;
  }

  async getProjects(): Promise<Project[]> {
    const params = {
      TableName: this.tableName,
    };

    const items = await performDynamoDbOperation(params, "scan");
    return (items as Project[]) || [];
  }

  async updateProject(
    projectId: string,
    updates: Partial<Pick<Project, "projectName">>,
  ): Promise<Project> {
    const updateParts: string[] = [];
    const attrValues: Record<string, unknown> = {};
    const attrNames: Record<string, string> = {};

    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) continue;
      updateParts.push(`#${key} = :${key}`);
      attrValues[`:${key}`] = value;
      attrNames[`#${key}`] = key;
    }

    updateParts.push("#updatedAt = :updatedAt");
    attrValues[":updatedAt"] = new Date().toISOString();
    attrNames["#updatedAt"] = "updatedAt";

    const params = {
      TableName: this.tableName,
      Key: { projectId },
      UpdateExpression: `SET ${updateParts.join(", ")}`,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: attrValues,
      ReturnValues: "ALL_NEW",
    };

    const result = await performDynamoDbOperation(params, "update");
    return result as Project;
  }
}
