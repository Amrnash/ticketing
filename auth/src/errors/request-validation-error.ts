import { CustomError } from "./custom-error";
import { ValidationError, Result } from "express-validator";

export class RequestValidationError extends CustomError {
  status = 400;
  constructor(public errors: ValidationError[]) {
    super("");
  }
  serializeError(): { message: string; field?: string | undefined }[] {
    return this.errors.map((error) => {
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      }
      return { message: error.msg };
    });
  }
}
