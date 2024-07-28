import { ErrorCode, HttpException } from "./root";

export class InternalException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, errors: any) {
    super(message, 500, errorCode, errors);
  }
}
