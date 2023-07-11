import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
  status = 401;
  constructor() {
    super("You are not authorized");
  }
  serializeError(): { message: string; field?: string | undefined }[] {
    return [{ message: "You are not authorized" }];
  }
}
