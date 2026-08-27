import assert from "node:assert";
import AppError from "./AppError";
import type AppErrorCode from "./appErrorCode";
import type { HttpStatusCode } from "./http";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode,
) => asserts condition;

const appAssert: AppAssert = (
  condition: any,
  httpStatusCode,
  message,
  appErrorCode,
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));

export default appAssert;
