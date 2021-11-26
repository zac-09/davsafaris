import mongoose from "mongoose";
import slugify from "slugify";

interface TourDoc extends mongoose.Document {
  name: string;
  description: string;
  summary: string;
  slug: string;
  tourActivities: [string];
  dayActivityDescription: [string];
  duration: number;
  maxGroupSize: number;
  ratingsQuantity: number;
  price: number;
  imageCover: string;
  images: [String];
  createdAt: Date;
  locations: [string];
  packageDetails: {};
  ratingsAverage: number;
}

interface TourModel extends mongoose.Model<TourDoc> {}

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "A tour must have a description"],
    },
    summary: {
      type: String,
      required: [true, "A tour must have a summary"],
    },
    slug: String,
    tourActivities: [String],
    dayActivityDescription: [],
    duration: {
      type: Number,
      required: [true, "A tour must have a duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    packageDetails: {
      type: {},
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val: number) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: "2dsphere" });

tourSchema.pre("save", function (next) {
  this.set("slug", slugify(this.get("name"), { lower: true }));
  next();
});

const Tour = mongoose.model<TourDoc, TourModel>("Tour", tourSchema);

export { Tour };
 