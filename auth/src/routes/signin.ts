import express, { NextFunction, Request, Response } from "express";
import { compare } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { BadRequestError } from "../errors/bad-request-error";
import { InternalServerError } from "../errors/internal-server-error";
import { validateRequest } from "../middlewares/validate-request";
import jwt from "jsonwebtoken";
import { body } from "express-validator";

const router = express.Router();
const prisma = new PrismaClient();

router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const exisitingUser = await prisma.user.findFirst({ where: { email } });
      if (!exisitingUser)
        return next(new BadRequestError("Invalid credentials"));

      const isCorrectPassword = await compare(password, exisitingUser.password);
      if (!isCorrectPassword)
        return next(new BadRequestError("Invalid credentials"));

      const user = {
        id: exisitingUser.id,
        name: exisitingUser.name,
        email: exisitingUser.email,
      };
      const token = jwt.sign(user, process.env.JWT_SECRET!);
      req.session = {
        jwt: token,
      };
      return res.send({
        message: "",
        user,
      });
    } catch (error: any) {
      next(new InternalServerError(error.message));
    }
  }
);

export { router as signinRouter };
