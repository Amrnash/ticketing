export abstract class CustomError extends Error {
  constructor(public message: string) {
    super(message);
  }
  abstract status: number;
  abstract serializeError(): { message: string; field?: string }[];
}
