import express from "express";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signupRouter } from "./routes/signup";
import { signoutRouter } from "./routes/signout";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";
import cookieSession from "cookie-session";

const app = express();
app.use(
  cookieSession({
    secure: false,
    signed: false,
  })
);
if (!process.env.JWT_SECRET) console.error("JWT_SECRET is not provided");
app.use(express.json());
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.all("*", () => {
  throw new NotFoundError("");
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
