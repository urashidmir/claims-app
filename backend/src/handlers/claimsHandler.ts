import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ClaimsService } from "../modules/claims/claimsService";
import { handleError } from "../utils/errorUtils";
import { CreateClaimInput, UpdateClaimInput } from "../types/claim";

const claimsService = new ClaimsService();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/json",
};

export const createClaimHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};

    const input: CreateClaimInput = {
      projectId: body.projectId,
      claimPeriodStart: body.claimPeriodStart,
      claimPeriodEnd: body.claimPeriodEnd,
      amount: Number(body.amount),
    };

    const newClaim = await claimsService.createClaim(input);

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify(newClaim),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const getClaimsHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const projectId = event.queryStringParameters?.projectId as
      | string
      | undefined;

    const claims = await claimsService.getClaims(projectId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(claims),
    };
  } catch (error) {
    return handleError(error);
  }
};

export const updateClaimHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  try {
    const { id } = event.pathParameters || {};
    if (!id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: "id path parameter is required" }),
      };
    }

    const body = event.body ? JSON.parse(event.body) : {};
    const updates: UpdateClaimInput = {};

    if ("companyName" in body) updates.companyName = body.companyName;
    if ("claimPeriodStart" in body)
      updates.claimPeriodStart = body.claimPeriodStart;
    if ("claimPeriodEnd" in body) updates.claimPeriodEnd = body.claimPeriodEnd;
    if ("amount" in body) updates.amount = Number(body.amount);
    if ("status" in body) updates.status = body.status;

    const updatedClaim = await claimsService.updateClaim(id, updates);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(updatedClaim),
    };
  } catch (error) {
    return handleError(error);
  }
};
