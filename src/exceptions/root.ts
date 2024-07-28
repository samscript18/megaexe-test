export class HttpException extends Error {
  message: string;
  statusCode: number;
  errorCode: ErrorCode;
  errors: any;

  constructor(
    message: string,
    statusCode: number,
    errorCode: ErrorCode,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_ALREADY_EXISTS = 1001,
  USER_NOT_FOUND = 1002,
  INCORRECT_PASSWORD = 2001,
  INTERNAL_SERVER_ERR0R = 3001,
  UNPROCESSABLE_ENTITY = 4001,
  UNAUTHORIZED = 4002,
  POST_NOT_FOUND = 5001,
}
