import mongoose from "mongoose";
import { ObjectId } from "mongoose";
interface postAttributes {
  name: string;
  postImage: string;
  post_content: string;
  post_blocks: any[];
}

interface postModel extends mongoose.Model<postDoc> {
  build(attributes: postAttributes): postDoc;
}
export interface postDoc extends mongoose.Document {
    name: string;
    postImage: string;
    post_content: string;
    post_blocks: any[];
  createdAt: Date;
}

const postSchema = new mongoose.Schema(
  {
  

    postImage: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "name can not be empty!"],
    },
    post_content: {
      type: String,
      required: [true, "post_content can not be empty!"],
    },
    post_blocks: [],

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

// postSchema.pre(/^find/, function(next) {
//     this.populate('user').populate({
//       path: 'tour',
//       select: 'name'
//     });
//     next();
//   });

const Post = mongoose.model<postDoc, postModel>("Post", postSchema);

export { Post };
