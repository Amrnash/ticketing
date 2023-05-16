import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  status = 404;
  serializeError(): { message: string; field?: string | undefined }[] {
    return [{ message: "Not Found!" }];
  }
}
