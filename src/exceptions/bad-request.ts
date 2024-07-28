import { ErrorCode, HttpException } from "./root";

export class BadRequestsException extends HttpException {
  constructor(message: string, errorCode: ErrorCode) {
    super(message, 400, errorCode, null);
  }
}
