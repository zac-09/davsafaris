import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import Review from "../models/review";
import { Email } from "../utils/email";
import { Tour } from "../models/tour";
import { AppError } from "../utils/error";
import { AuthUserRequest } from "../utils/interfaces";
export const createReview = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.body.tour);
    if (!tour) return next(new AppError("no tour found", 404));

    const review = await Review.create({ ...req.body });
    res.status(201).json({
      status: "success",
      review,
    });
    await new Email(
      process.env.ADMIN_EMAIL,
      "review made",
      "A review has been made"
    ).sendReviewNotification(
      req.body.user_name,
      ` ${tour.name}`,
      req.body.review,
      req.body.rating,
      req.body.country_of_residence,
      req.body.visit_month,
      req.body.visit_year,
    );
    await new Email(
      req.body.email,
      "review made",
      "A review has been made"
    ).sendReviewInfo(
      req.body.user_name,
      ` ${tour.name}`,
    );
  }
);

export const getAllReviews = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    let reviews;
    const tourId = req.params.id;
    let tour;
    if (tourId) {
      reviews = await Review.find({ tour: tourId });
      tour = await Tour.findById(tourId);
      res.status(200).json({
        status: "success",
        reviews,
        tour,
      });
      return;
    } else {
      reviews = await Review.find({});
      res.status(200).json({
        status: "success",
        reviews,
      });
    }
  }
);

export const getReview = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) return next(new AppError("review not found", 404));
    res.status(200).json({ status: "success", review });
  }
);

export const updateReview = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndUpdate(reviewId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) {
      return next(new AppError("Review with that id not found", 404));
    }

    res.status(201).json({
      status: "success",
      review,
    });
  }
);
export const deleteReview = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const reviewId = req.params.id;
    const review = await Review.findByIdAndDelete(reviewId);

    res.status(204).json({
      status: "success",
    });
  }
);
