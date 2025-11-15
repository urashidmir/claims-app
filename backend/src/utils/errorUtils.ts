import { ValidationError, NotFoundError } from "./errors";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Content-Type": "application/json",
};

function getMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  return "Internal Server Error";
}

function getStatusCode(error: unknown): number {
  if (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as Record<string, unknown>).statusCode === "number"
  ) {
    return (error as { statusCode: number }).statusCode;
  }

  if (error instanceof ValidationError) return 400;
  if (error instanceof NotFoundError) return 404;

  return 500;
}

export const handleError = (error: unknown) => {
  console.error("Error:", error);

  const message = getMessage(error);
  const statusCode = getStatusCode(error);

  return {
    statusCode,
    headers,
    body: JSON.stringify({ message }),
  };
};
