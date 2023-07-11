import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  status = 500;
  constructor(message: string) {
    super(message);
  }
  serializeError(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
