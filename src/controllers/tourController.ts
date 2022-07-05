import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Tour } from "../models/tour";
import { AppError } from "../utils/error";
import { uploadImageToStorage } from "./fileController";

export const createTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.dayActivityDescription) {
      req.body.dayActivityDescription = JSON.parse(
        req.body.dayActivityDescription
      );
    }
    if (req.body.tourActivities) {
      req.body.tourActivities = JSON.parse(req.body.tourActivities);
    }
    if (req.body.packageDetails) {
      req.body.packageDetails = JSON.parse(req.body.packageDetails);
    }

    let file = req.file;
    if (file) {
      const downloadURL = await uploadImageToStorage(file);

      req.body.imageCover = downloadURL;
    }

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
    let file = req.file;

    if (file) {
      const downloadURL = await uploadImageToStorage(file);

      req.body.imageCover = downloadURL;
    }
    if (req.body.dayActivityDescription) {
      req.body.dayActivityDescription = JSON.parse(
        req.body.dayActivityDescription
      );
    }
    if (req.body.tourActivities) {
      req.body.tourActivities = JSON.parse(req.body.tourActivities);
    }
    if (req.body.packageDetails) {
      req.body.packageDetails = JSON.parse(req.body.packageDetails);
    }
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
    if (!tour)
      return next(
        new AppError(`tour with: ${tour_id} could not be found`, 404)
      );

    res.status(200).json({
      status: "success",
      tour,
    });
  }
);
export const getTourByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tourSlug = req.params.slug;

    const tour = await Tour.findOne({ slug: tourSlug });
    if (!tour)
      return next(
        new AppError(`tour with ${tourSlug} could not be found`, 404)
      );
    res.status(200).json({
      status: "success",
      tour,
    });
  }
);
export const deleteTour = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tour_id = req.params.id;

    const tour = await Tour.findByIdAndDelete(tour_id);

    res.status(204).json({});
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

export const uploadTourImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore: Unreachable code error
    const files: File[] = req.files;
    const tourID = req.params.id;
    if (!files) return next(new AppError("please attach images ", 400));

    for (let i = 0; i < files.length; i++) {
      const file: any = files[i];
      const downlaodURL = await uploadImageToStorage(file);
      await Tour.findByIdAndUpdate(
        tourID,
        {
          $push: {
            images: downlaodURL,
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    const tour = await Tour.findById(tourID);
    res.status(200).json({
      status: "success",
      tour,
    });
  }
);
