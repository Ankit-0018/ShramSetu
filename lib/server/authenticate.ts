import "server-only";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyToken, type AccessTokenPayload } from "./jwt";
import { UNAUTHORIZED } from "./http";
import AppError from "./AppError";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public errorCode?: string,
  ) {
    super(message);
  }
}

/**
 * Mirrors the Express `authenticate` middleware: extracts the userId from
 * the `Authorization: Bearer <accessToken>` header. Throws HttpError(401)
 * if missing/invalid — callers should catch and translate via toErrorResponse.
 */
export function requireUserId(req: NextRequest): {
  userId: string;
  sessionId: string;
} {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    throw new HttpError(UNAUTHORIZED, "Authorization token is required");
  }

  const { payload, error } = verifyToken<AccessTokenPayload>(token);

  if (!payload) {
    throw new HttpError(UNAUTHORIZED, error || "Invalid access token");
  }

  return { userId: payload.userId, sessionId: payload.sessionId };
}

/**
 * Converts a thrown error (HttpError, AppError-shaped, ZodError, or unknown)
 * into the JSON error response the frontend's ApiError expects.
 */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    return NextResponse.json(
      { message: error.message, errorCode: error.errorCode },
      { status: error.status },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message, errorCode: error.errorCode },
      { status: error.statusCode },
    );
  }

  // ZodError
  if (error && typeof error === "object" && "issues" in error) {
    const zodError = error as { issues: { path: (string | number)[]; message: string }[] };
    const errors = zodError.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return NextResponse.json({ errors }, { status: 400 });
  }

  console.error(error);
  return NextResponse.json(
    { error: "INTERNAL SERVER ERROR." },
    { status: 500 },
  );
}
