import { compareValue, hashValue } from "../bcrypt";
import verificationCodeType from "../verificationCode";
import { FiveMinutesFromNow, ThirtyDaysFromNow } from "../date";
import prisma from "../prisma";
import type { VerifyOtp } from "../types";
import appAssert from "../appAssert";
import {
  CONFLICT,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "../http";
import {
  refreshTokenSignOptions,
  signToken,
  verifyToken,
  type RefreshTokenPayload,
} from "../jwt";
import { createHash } from "crypto";
import { redis, connectRedis } from "../redis";
import { generateOtp } from "../otp";
import { sendSmsOtp } from "../sms";

export type SendOtpParams = {
  phone: string;
  fullName?: string;
  type: verificationCodeType;
};

export const SendOtp = async ({ phone, type, fullName }: SendOtpParams) => {
  await connectRedis();

  const user = await prisma.user.findUnique({
    where: {
      phoneNumber: phone,
    },
  });
  appAssert(
    !(type === "REGISTER" && user),
    CONFLICT,
    "Phone Number already registered",
  );
  appAssert(!(type === "LOGIN" && !user), NOT_FOUND, "User does not Exist");

  const rateLimitKey = `otp_rate_limit:${phone}`;

  const attempts = await redis.incr(rateLimitKey);

  if (attempts === 1) {
    await redis.expire(rateLimitKey, 300);
  }

  appAssert(
    attempts <= 3,
    TOO_MANY_REQUESTS,
    "Too many OTP requests. Please try again after 1 minute.",
  );

  const existingVerificationId = await redis.get(
    `active_verification:${phone}:${type}`,
  );

  if (existingVerificationId) {
    await redis.del(`verification:${existingVerificationId}`);
  }

  const otp = generateOtp();

  await sendSmsOtp({ phone, otp, type });

  const hashedOtp = await hashValue(otp);
  const verificationId = crypto.randomUUID();
  await redis.set(
    `verification:${verificationId}`,
    JSON.stringify({
      phoneNumber: phone,
      fullName: fullName || user?.fullName,
      code: hashedOtp,
      type,
    }),
    {
      EX: 300,
    },
  );

  await redis.set(`active_verification:${phone}:${type}`, verificationId, {
    EX: 300,
  });

  return {
    success: true,
    verificationId,
    message: "OTP sent successfully",
  };
};

export const verifyOtp = async ({
  verificationId,
  verificationCode,
  userAgent,
}: VerifyOtp) => {
  await connectRedis();

  const verificationData = await redis.get(`verification:${verificationId}`);

  appAssert(verificationData, CONFLICT, "No Verification Session");

  const verification = JSON.parse(verificationData) as {
    phoneNumber: string;
    fullName: string;
    code: string;
    type: "REGISTER" | "LOGIN";
  };

  const isCodeCorrect = await compareValue(verificationCode, verification.code);

  appAssert(isCodeCorrect, UNAUTHORIZED, "Verification Code is Incorrect");
  let user;

  if (verification.type === "REGISTER") {
    user = await prisma.user.create({
      data: {
        fullName: verification.fullName,
        phoneNumber: verification.phoneNumber,
        isProfileCompleted: false,
      },
    });
  } else if (verification.type === "LOGIN") {
    user = await prisma.user.findUnique({
      where: {
        phoneNumber: verification.phoneNumber,
      },
    });

    appAssert(user, NOT_FOUND, "User does not exists");
  } else {
    throw new Error("Invalid verification type");
  }

  await redis.del(`verification:${verificationId}`);

  await redis.del(
    `active_verification:${verification.phoneNumber}:${verification.type}`,
  );

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      userAgent: userAgent ? userAgent : "unknown",
      refreshTokenHash: "",
      expiresAt: ThirtyDaysFromNow(),
    },
  });

  const sessionInfo = {
    sessionId: session.id,
  };
  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const refreshTokenHash = createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      refreshTokenHash,
    },
  });
  const accessToken = signToken({
    userId: user.id,
    ...sessionInfo,
  });

  return {
    success: true,
    message: "OTP verification successful",
    user,
    accessToken,
    type: verification.type,
    refreshToken,
  };
};

export const refreshUserAccessToken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secret: refreshTokenSignOptions.secret,
  });

  appAssert(payload, UNAUTHORIZED, "Invalid refresh Token");

  const session = await prisma.session.findUnique({
    where: {
      id: payload.sessionId,
    },
  });

  appAssert(session, UNAUTHORIZED, "Session does not exist");

  appAssert(session.expiresAt > new Date(), UNAUTHORIZED, "Session expired");

  const incomingRefreshTokenHash = createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  appAssert(
    incomingRefreshTokenHash === session.refreshTokenHash,
    UNAUTHORIZED,
    "Invalid refresh token",
  );

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session.id,
  });

  const remainingTime = session.expiresAt.getTime() - Date.now();

  let newRefreshToken: string | null = null;

  if (remainingTime < 24 * 60 * 60 * 1000) {
    const updatedExpiry = ThirtyDaysFromNow();

    newRefreshToken = signToken(
      {
        sessionId: session.id,
      },
      refreshTokenSignOptions,
    );

    const newRefreshTokenHash = createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: updatedExpiry,
        refreshTokenHash: newRefreshTokenHash,
      },
    });
  }

  return {
    accessToken,
    newRefreshToken,
  };
};
