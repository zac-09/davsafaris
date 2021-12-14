import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "./controllers/errorController";
import { userRouter } from "./routes/userRoutes";
import { tourRouter } from "./routes/tourRoutes";
import { bookingRouter } from "./routes/bookingRoutes";
const app = express();

app.set("trust proxy", true);
app.use(json());
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use(errorHandler);

app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    status: "error end point not found",
    message: req.originalUrl,
  });
});

export { app };
