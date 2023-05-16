export abstract class CustomError extends Error {
  constructor() {
    super();
  }
  abstract status: number;
  abstract serializeError(): { message: string; field?: string }[];
}
