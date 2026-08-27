import type AppErrorCode from "./appErrorCode";
import type { HttpStatusCode } from "./http";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode?: AppErrorCode,
  ) {
    super(message);
  }
}

export default AppError;
