import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Subscriber } from "../models/subscriber";
import { Tour } from "../models/tour";
import { AppError } from "../utils/error";
import { AuthUserRequest } from "../utils/interfaces";
import { Email } from "../utils/email";

export const createSubscriber = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    if (req.body.is_add_to_news_letter) {
      const subscriber = await Subscriber.create({ ...req.body });
    }
    await new Email(
      process.env.ADMIN_EMAIL,
      "subscriber message",
      "message from subscriber"
    ).sendBasicMail(
      req.body.name,
      "subscriber message",
      req.body.email,
      req.body.contact
    );
    res.status(201).json({
      status: "success",
    });
  }
);
export const joinNewsLetter = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const subscriber = await Subscriber.create({ ...req.body });

    await new Email(
      req.body.email,
      "subscriber message",
      "Thank you for subscribing"
    ).sendSubscriberNotfication(
      `https://www.davsafaris.com/api/v1/subscribers/unsubscribe/${req.body.email}`
    );
    res.status(201).json({
      status: "success",
    });
  }
);
export const unsubscribeNewsLetter = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const subscriber = await Subscriber.deleteOne({ email: req.params.email });

    res.status(204).json({
      status: "success",
    });
  }
);
export const getSubscriber = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const SubscriberId = req.params.id;
    const subscriber = await Subscriber.findById(SubscriberId);
    if (!subscriber)
      return next(new AppError("Subscriber with that id not found", 404));
    res.status(201).json({
      status: "success",
      subscriber,
    });
  }
);
export const getAllSubscribers = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const Subscribers = await Subscriber.find({});
    if (!Subscribers) return next(new AppError("no Subscribers found", 404));
    res.status(201).json({
      status: "success",
      Subscribers,
    });
  }
);
export const updateSubscriber = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const SubscriberId = req.params.id;
    const subscriber = await Subscriber.findByIdAndUpdate(
      SubscriberId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!subscriber)
      return next(new AppError("Subscriber with that id not found", 404));
    res.status(201).json({
      status: "success",
      subscriber,
    });
  }
);
export const deleteSubscriber = catchAsync(
  async (req: AuthUserRequest, res: Response, next: NextFunction) => {
    const SubscriberId = req.params.id;
    const booking = await Subscriber.findByIdAndDelete(SubscriberId);

    res.status(204).json({
      status: "success",
    });
  }
);
