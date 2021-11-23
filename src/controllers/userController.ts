import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/user";
import { AppError } from "../utils/error";
import jwt, { Secret } from "jsonwebtoken";
import { promisify } from "util";
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

exports.protect = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    const JWT_SECRET = process.env.JWT_SECRET!;
    // 2) Verification token
    const decoded: any = await promisify(jwt.verify)(token);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req["user"] = currentUser;
    res.locals.user = currentUser;
    next();

    // console.log("user object",req.locals.user)
  }
);
