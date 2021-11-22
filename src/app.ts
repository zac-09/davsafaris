import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "./controllers/errorController";
import { userRouter } from "./routes/userRoutes";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use("/api/v1/users", userRouter);
app.use(errorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error end point not found",
    message: req.originalUrl,
  });
});

export { app };
