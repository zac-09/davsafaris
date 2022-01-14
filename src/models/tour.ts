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
      
      trim: true,
    },
    country: {
      type: String,

      trim: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
    summary: {
      type: String,
    },
    slug: String,
    tourActivities: [String],
    dayActivityDescription: [],
    duration: {
      type: Number,
    },
    maxGroupSize: {
      type: Number,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    locations: [],
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
