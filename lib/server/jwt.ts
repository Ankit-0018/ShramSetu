import "server-only";
import type { SignOptions, VerifyOptions } from "jsonwebtoken";
import type { Prisma } from "./generated/prisma/client";
import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "./env";
type SessionId = Prisma.$SessionPayload["scalars"]["id"];
type UserID = Prisma.$UserPayload["scalars"]["id"];

export type RefreshTokenPayload = {
  sessionId: SessionId;
};

export type AccessTokenPayload = {
  sessionId: SessionId;
  userId: UserID;
};

type SignOptionsAndSecret = SignOptions & {
  secret: string;
};

const defaults: SignOptions = {
  audience: ["user"],
};

const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15min",
  secret: JWT_SECRET,
};

export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secret: JWT_REFRESH_SECRET,
};

export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret,
) => {
  const { secret, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secret, {
    ...defaults,
    ...signOpts,
  });
};

export const verifyToken = <TPayLoad extends Object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secret: string },
) => {
  const { secret = JWT_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      audience: ["user"],
      ...verifyOpts,
    }) as TPayLoad;

    return {
      payload
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
