import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { InternalServerError } from "../errors/internal-server-error";

interface Payload {
  email: string;
  password: string;
}
declare global {
  namespace Express {
    interface Request {
      currentUser?: Payload;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session || !req.session.jwt)
      return res.send({ currentUser: null });
    const payload = (await verify(
      req.session.jwt,
      process.env.JWT_SECRET!
    )) as Payload;
    req.currentUser = payload;
    next();
  } catch (error: any) {
    return next(new InternalServerError(error.message));
  }
};
