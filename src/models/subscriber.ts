import mongoose from "mongoose";
import { ObjectId } from "mongoose";
interface subscriberAttributes {
  name: string;
  email: string;
  phone: string;
}

interface subscriberModel extends mongoose.Model<subscriberDoc> {
  build(attributes: subscriberAttributes): subscriberDoc;
}
export interface subscriberDoc extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
}

const subscriberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "a subscriber must have an email"],
      unique: true,
    },
    phone: {
      type: String,
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

const Subscriber = mongoose.model<subscriberDoc, subscriberModel>(
  "Subscriber",
  subscriberSchema
);

export { Subscriber };
