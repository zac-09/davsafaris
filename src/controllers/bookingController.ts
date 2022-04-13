import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Booking } from "../models/booking";
import { Tour } from "../models/tour";
import { AppError } from "../utils/error";
import { Email } from "../utils/email";
import { AuthUserRequest } from "../utils/interfaces";

export const createBooking = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const tour = await Tour.findById(req.body.tour);
    if (!tour) return next(new AppError("no tour found", 404));
    const booking = await Booking.create({ ...req.body });

    res.status(201).json({
      status: "success",
      booking,
    });
    await new Email(
      process.env.ADMIN_EMAIL,
      "booking created!",
      "A tour has been booked"
    ).sendBasicMail(
      req.body.user_name,
      `booking has been made for tour:  ${tour.name}`,
      req.body.email,
      req.body.phone,
      req.body.country_of_residence,
      req.body.travel_plans
    );
    await new Email(
      req.body.email,
      "booking created",
      "A tour has been booked"
    ).sendBookingNotification(
      ` ${tour.name}`,
      req.body.user_name
    );
  }
);
export const getBooking = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId);
    if (!booking)
      return next(new AppError("Booking with that id not found", 404));
    res.status(201).json({
      status: "success",
      booking,
    });
  }
);
export const getAllBookings = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const bookings = await Booking.find({});
    if (!bookings) return next(new AppError("no bookings found", 404));
    res.status(201).json({
      status: "success",
      bookings,
    });
  }
);
export const updateBooking = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndUpdate(bookingId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!booking)
      return next(new AppError("Booking with that id not found", 404));
    res.status(201).json({
      status: "success",
      booking,
    }); 
  }
);
export const deleteBooking = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const bookingId = req.params.id;
    const booking = await Booking.findByIdAndDelete(bookingId);

    res.status(204).json({
      status: "success",
    });
  }
);
