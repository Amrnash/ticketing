import express, { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { PrismaClient } from "@prisma/client";
import { genSaltSync, hash } from "bcryptjs";
import { BadRequestError } from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new RequestValidationError(errors.array()));
    }
    const { email, name, password } = req.body;
    const exisitingUser = await prisma.user.findFirst({ distinct: email });
    if (exisitingUser) next(new BadRequestError("Email already exists"));
    // hash password
    const salt = genSaltSync(10);
    const hashedPassword = await hash(password, salt);
    // create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, email: true },
    });
    // generate token
    const token = jwt.sign(user, process.env.JWT_SECRET!);
    if (req.session) req.session.jwt = token;
    return res.status(201).send({ message: "created", user });
  }
);

export { router as signupRouter };
