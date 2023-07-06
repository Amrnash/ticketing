import { CustomError } from "./custom-error";
export class BadRequestError extends CustomError {
  status = 400;
  constructor(public message: string) {
    super(message);
  }
  serializeError(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
