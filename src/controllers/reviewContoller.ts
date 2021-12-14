import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import Review from "../models/review";
import { Tour } from "../models/tour";
import { AppError } from "../utils/error";
import {AuthUserRequest} from '../utils/interfaces'
export const createReview = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.body.tour);
    if (!tour) return next(new AppError("no tour found", 404));

    const review = await Review.create({ ...req.body, user: req.user.id });
    res.status(201).json({
      status: "success",
      review,
    });
  }
);

export  const getAllReviews = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {})
