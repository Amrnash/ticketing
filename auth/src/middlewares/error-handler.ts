import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import { RequestValidationError } from "../errors/request-validation-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.status).send({ errors: err.serializeError() });
  }
  return res
    .status(400)
    .send({ errors: [{ message: "Something went wrong!" }] });
};
