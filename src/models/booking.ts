import mongoose from "mongoose";
import { ObjectId } from "mongoose";
interface BookingAttributes {
  tour: string;
  user: string;
}

interface BookingModel extends mongoose.Model<BookingDoc> {
  build(attributes: BookingAttributes): BookingDoc;
}
export interface BookingDoc extends mongoose.Document {
  tour: ObjectId;
  User: ObjectId;
  price: number;
  createdAt: Date;
}

const bookingSchema = new mongoose.Schema(
  {
    tour: {
      type: "ObjectId",
      ref: "Tour",
      required: [true, "Booking must belong to a Tour!"],
    },
    price: {
      type: Number,
      require: [true, "Booking must have a price."],
    },
    country_of_residence: {
      type: String,
      required: [true, "country_of_residence can not be empty!"],
    },
    user_name: {
      type: String,
      required: [true, "user_name can not be empty!"],
    },
    phone: {
      type: String,
      required: [true, "phone can not be empty!"],
    },
    email: {
      type: String,
      required: [true, "email can not be empty!"],
    },
    travel_plans: {
      type: String,
      required: [true, "travel plans can not be empty!"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// bookingSchema.pre(/^find/, function(next) {
//     this.populate('user').populate({
//       path: 'tour',
//       select: 'name'
//     });
//     next();
//   });

const Booking = mongoose.model<BookingDoc, BookingModel>(
  "Booking",
  bookingSchema
);

export { Booking };
