import CustomError from ".";

export enum ErrorCodes {
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  InternalServerError = 500,
}
export const errorsCodesLabel = {
  [ErrorCodes.BadRequest]: "Bad Request",
  [ErrorCodes.Unauthorized]: "Unauthorized",
  [ErrorCodes.Forbidden]: "Forbidden",
  [ErrorCodes.NotFound]: "Not Found",
  [ErrorCodes.InternalServerError]: "Internal Server Error",
};
class ServerError extends CustomError {
  public code: ErrorCodes;
  public label: string;

  constructor(code?: ErrorCodes, message?: string) {
    if ((code && !Object.values(ErrorCodes).includes(code)) || message) {
      throw new CustomError("Invalid error code provided");
    }
    const errorMessage =
      errorsCodesLabel[code as ErrorCodes] || "Unknown Error";
    super(message || errorMessage);
  }
}
export default ServerError;
