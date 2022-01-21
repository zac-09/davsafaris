import mongoose, { Date } from "mongoose";
import { Tour } from "./tour";
import { ObjectId } from "mongoose";
var id = new mongoose.Types.ObjectId();
interface ReviewDocument extends mongoose.Document {
  review: string;
  rating: number;
  createdAt: Date;
  tour: ObjectId;
  user: ObjectId;
  calcAverageRatings(): any;
}
interface ReviewModel extends mongoose.Model<ReviewDocument> {
  calcAverageRatings(): any;
  r: ReviewDocument;
}
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "Review can not be empty!"],
    },
    country_of_residence: {
      type: String,
      required: [true, "country_of_residence can not be empty!"],
    },
    visit_month: {
      type: String,
      required: [true, "visit_month can not be empty!"],
    },
    visit_year: {
      type: String,
      required: [true, "visit_year can not be empty!"],
    },
    rating: { 
      type: Number,
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: "ObjectId",
      ref: "Tour",
      required: [true, "Review must belong to a tour."],
    },
    user_name : {
      type: String,
      required: [true, "Review must belong to a user."],

    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.static("calcAverageRatings", async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
});

reviewSchema.post("save", function (doc) {
  // this points to current review

  doc.constructor.calcAverageRatings(this.get("tour"));
});

// findByIdAndUpdate
// findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function ( next: any) {
  // doc = await this.findOne();
  // console.log("from pre", await this.updateOne({},await this.findOne()));
  // @ts-ignore: Unreachable code error
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function (doc, next) {
  // await this.findOne(); does NOT work here, query has already executed
  // console.log("from post ", doc, this.get("tour"), doc.tour);
  await doc.constructor.calcAverageRatings(doc.tour);
  next();
});

const Review = mongoose.model<ReviewDocument, ReviewModel>(
  "Review",
  reviewSchema
);

export default Review;
