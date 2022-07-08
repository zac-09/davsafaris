import { catchAsync } from "../utils/catchAsync";
import { Request, Response, NextFunction } from "express";
import { Post } from "../models/post";
import { AppError } from "../utils/error";
import { uploadImageToStorage } from "./fileController";
import slugify from "slugify";
import { Email } from "../utils/email";

export const createPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.post_blocks) {
      req.body.post_blocks = JSON.parse(req.body.post_blocks);
    }
    if (req.body.key_words) {
      req.body.key_words = JSON.parse(req.body.key_words);
    }
    let file = req.file;
    if (file) {
      const downloadURL = await uploadImageToStorage(file);

      req.body.postImage = downloadURL;
    }

    const post = await Post.create(req.body);
    await new Email(process.env.SEO_EMAIL, "SEO Optimization","SEO submission").sendSEO(post.name,req.body.key_words.join(","));
    
    res.status(201).json({
      status: "success",
      post,
    });
  }
);

export const editPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Post_id = req.params.id;
    let file = req.file;
    if (req.body.key_words) {
      req.body.key_words = JSON.parse(req.body.key_words);
    }
    if (req.body.post_blocks) {
      req.body.post_blocks = JSON.parse(req.body.post_blocks);
    }
    if (file) {
      const downloadURL = await uploadImageToStorage(file);

      req.body.postImage = downloadURL;
    }
    const post = await Post.findByIdAndUpdate(Post_id, req.body, {
      new: true,
      runValidators: true,
    });
    const oldPost = await Post.findById(Post_id);
    const new_key_words: String[] = [];

    if(req.body.key_words){
     
      req.body.key_words.map((el:any)=>{
        const isContained  = oldPost!.key_words.find(el2=>el2.toLowerCase()===el.toLowerCase());
        if(!isContained){
          new_key_words.push(el);
        } 
      })}
    if (!post) return next(new AppError("Post not found", 404));

    res.status(200).json({
      status: "ok",
      post,
    });
  }
);

export const getAllPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Posts = await Post.find({});

    res.status(200).json({
      status: "success",
      Posts,
    });
  }
);
export const slugifyPosts = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Posts = await Post.find({});
    for (let i = 0; i < Posts.length; i++) {
      await Post.findByIdAndUpdate(
        Posts[i]._id,
        {
          slug: slugify(Posts[i].name, { lower: true }),
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    res.status(200).json({
      status: "success",
      Posts,
    });
  }
);
export const getPost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Post_id = req.params.id;

    const post = await Post.findById(Post_id);
    if (!post)
      return next(
        new AppError(`Post with: ${Post_id} could not be found`, 404)
      );

    res.status(200).json({
      status: "success",
      post,
    });
  }
);

export const deletePost = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const Post_id = req.params.id;

    const post = await Post.findByIdAndDelete(Post_id);

    res.status(204).json({});
  }
);

export const getPostsByCountry = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const country = req.params.country.toLowerCase();

    const Posts = await Post.find({ country: country });
    if (!Posts || Posts.length < 1)
      return next(new AppError("No Posts found in that country", 404));

    res.status(200).json({
      status: "success",
      Posts,
    });
  }
);

export const uploadPostImages = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore: Unreachable code error
    const files: File[] = req.files;
    const PostID = req.params.id;
    if (!files) return next(new AppError("please attach images ", 400));

    for (let i = 0; i < files.length; i++) {
      const file: any = files[i];
      const downlaodURL = await uploadImageToStorage(file);
      await Post.findByIdAndUpdate(
        PostID,
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
    const post = await Post.findById(PostID);
    res.status(200).json({
      status: "success",
      Post,
    });
  }
);

export const getPostByName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const postSlug = req.params.slug;

    const post = await Post.findOne({ slug: postSlug });
    if (!post)
      return next(
        new AppError(`post with ${postSlug} could not be found`, 404)
      );
    res.status(200).json({
      status: "success",
      post,
    });
  }
);
