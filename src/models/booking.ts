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
        type: 'ObjectId',
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
      },
      user: {
        type: 'ObjectId',
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
      },
      price: {
        type: Number,
        require: [true, 'Booking must have a price.']
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
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


const Booking = mongoose.model<BookingDoc, BookingModel>("Booking", bookingSchema);

export { Booking };
