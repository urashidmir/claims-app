import crypto from "crypto";
import {
  Claim,
  UpdateClaimInput,
  CreateEnrichedClaimInput,
} from "../../types/claim";
import { performDynamoDbOperation } from "../../utils/dynamoUtils";

export class ClaimsRepository {
  private claimsTable: string;

  constructor() {
    this.claimsTable = process.env.CLAIMS_TABLE || "ClaimsTable";
  }

  async createClaim(
    createEnrichedClaimInput: CreateEnrichedClaimInput,
  ): Promise<Claim> {
    const now = new Date().toISOString();

    const item: Claim = {
      ...createEnrichedClaimInput,
      claimId: crypto.randomUUID(),
      status: "Submitted",
      createdAt: now,
      updatedAt: now,
    };

    const params = {
      TableName: this.claimsTable,
      Item: item,
    };

    await performDynamoDbOperation(params, "put");
    return item;
  }

  async getClaim(claimId: string): Promise<Claim | null> {
    const params = {
      TableName: this.claimsTable,
      Key: { claimId },
    };

    const item = await performDynamoDbOperation(params, "get");
    return (item as Claim) || null;
  }

  async getClaims(projectId?: string): Promise<Claim[]> {
    if (projectId) {
      const params = {
        TableName: this.claimsTable,
        IndexName: "ProjectIdIndex",
        KeyConditionExpression: "projectId = :pid",
        ExpressionAttributeValues: { ":pid": projectId },
      };

      const result = (await performDynamoDbOperation(
        params,
        "query",
      )) as Claim[];

      return result || [];
    }

    const params = { TableName: this.claimsTable };
    const result = (await performDynamoDbOperation(params, "scan")) as Claim[];

    return result || [];
  }

  async updateClaim(
    claimId: string,
    updates: UpdateClaimInput,
  ): Promise<Claim> {
    const allowedFields: (keyof UpdateClaimInput)[] = [
      "companyName",
      "claimPeriodStart",
      "claimPeriodEnd",
      "amount",
      "status",
    ];

    const updateParts: string[] = [];
    const attrNames: Record<string, string> = {};
    const attrValues: Record<string, unknown> = {};

    for (const key of allowedFields) {
      const value = updates[key];
      if (value === undefined || value === null) continue;

      updateParts.push(`#${key} = :${key}`);
      attrNames[`#${key}`] = key;
      attrValues[`:${key}`] = value;
    }

    updateParts.push("#updatedAt = :updatedAt");
    attrNames["#updatedAt"] = "updatedAt";
    attrValues[":updatedAt"] = new Date().toISOString();

    const params = {
      TableName: this.claimsTable,
      Key: { claimId },
      UpdateExpression: `SET ${updateParts.join(", ")}`,
      ExpressionAttributeNames: attrNames,
      ExpressionAttributeValues: attrValues,
      ReturnValues: "ALL_NEW",
    };

    const updated = await performDynamoDbOperation(params, "update");
    return updated as Claim;
  }
}
