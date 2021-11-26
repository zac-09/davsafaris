import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/tour";
import { AppError } from "../utils/error";

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      tour,
    });
  }
);

export const editTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour_id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(tour_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) return next(new AppError("tour not found", 404));

    res.status(200).json({
      status: "ok",
      tour,
    });
  }
);

export const getAllTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find({});

    res.status(200).json({
      status: "success",
      tours,
    });
  }
);
export const getTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour_id = req.params.id;

    const tour = await Tour.findById(tour_id);

    res.status(200).json({
      status: "success",
      tour,
    });
  }
);

export const getToursByCountry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const country = req.params.country.toLowerCase();

    const tours = await Tour.find({ country: country });
    if (!tours || tours.length < 1)
      return next(new AppError("No tours found in that country", 404));

    res.status(200).json({
      status: "success",
      tours,
    });
  }
);
