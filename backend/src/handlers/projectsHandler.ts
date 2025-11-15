import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ProjectsService } from "../modules/projects/projectsService";
import { handleError } from "../utils/errorUtils";
import { Project } from "../types/project";

const projectsService = new ProjectsService();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json",
};

export const createProjectHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { projectName, companyName } = body;

    const newProject = await projectsService.createProject({
      projectName,
      companyName,
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newProject),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getProjectsHandler = async () => {
  try {
    const projects = await projectsService.getProjects();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(projects),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getProjectHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Project id is required" }),
      };
    }

    const project = await projectsService.getProject(id);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(project),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const updateProjectHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id;

    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "Project id is required" }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};

    const updates: Partial<Pick<Project, "projectName">> = {};
    if (typeof body.projectName === "string") {
      updates.projectName = body.projectName;
    }

    const updated = await projectsService.updateProject(id, updates);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updated),
    };
  } catch (error) {
    return handleError(error);
  }
};
