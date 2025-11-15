import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  ScanCommand,
  DeleteCommand,
  PutCommandInput,
  GetCommandInput,
  QueryCommandInput,
  UpdateCommandInput,
  ScanCommandInput,
  DeleteCommandInput,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
});

export const dynamoDb = DynamoDBDocumentClient.from(client);

type DynamoOperationType =
  | "put"
  | "get"
  | "query"
  | "update"
  | "scan"
  | "delete";

type DynamoParams =
  | PutCommandInput
  | GetCommandInput
  | QueryCommandInput
  | UpdateCommandInput
  | ScanCommandInput
  | DeleteCommandInput;

export const performDynamoDbOperation = async (
  params: DynamoParams,
  type: DynamoOperationType,
) => {
  try {
    switch (type) {
      case "put":
        return await dynamoDb.send(new PutCommand(params as PutCommandInput));

      case "get": {
        const res = await dynamoDb.send(
          new GetCommand(params as GetCommandInput),
        );
        return res.Item || null;
      }

      case "query": {
        const res = await dynamoDb.send(
          new QueryCommand(params as QueryCommandInput),
        );
        return res.Items || [];
      }

      case "update": {
        const res = await dynamoDb.send(
          new UpdateCommand(params as UpdateCommandInput),
        );
        return res.Attributes || null;
      }

      case "scan": {
        const res = await dynamoDb.send(
          new ScanCommand(params as ScanCommandInput),
        );
        return res.Items || [];
      }

      case "delete":
        return await dynamoDb.send(
          new DeleteCommand(params as DeleteCommandInput),
        );

      default:
        throw new Error(`Invalid DynamoDB operation type: ${type}`);
    }
  } catch (error) {
    console.error("🔥 DynamoDB Error:", error);
    throw error;
  }
};
