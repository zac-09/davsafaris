import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { AppError } from "../utils/error";
import jwt, { Secret } from "jsonwebtoken";

const signToken = (id: string) => {
  const jwtScret: Secret = process.env.JWT_SECRET!;
  return jwt.sign({ id }, jwtScret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (
  user: any,
  statusCode: number,
  res: Response
) => {
  const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN_HOURS!);
  const token = signToken(user._id);

  const expirationtime = new Date(Date.now() + JWT_EXPIRES_IN * 60 * 60 * 1000);
  const expiresIn = JWT_EXPIRES_IN * 60 * 60 * 1000;

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    expiresIn,
    expirationtime,
    user,
  });
};
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
      email,
    }).select("+password");
    if (!user || !user.correctPassword(password, user.password)) {
      return next(new AppError("Invalid crendetials", 403));
    }
    await createSendToken(user, 200, res);
  }
);

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
      email,
    });
    if (user) return next(new AppError("Email already exists", 400));
    const newUser = await User.create(req.body);
    await createSendToken(newUser, 201, res);
    
  }
);
