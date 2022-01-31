import express from "express";
import { uploadFile, uploadFiles } from "../controllers/fileController";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPost,
  getPostByName,
  slugifyPosts,
} from "../controllers/postController";
const router = express.Router();

router.post("/create", uploadFile, createPost);
router.patch("/updatePost/:id", uploadFile, editPost);
router.get("/getAllPosts", getAllPosts);
router.get("/getPostByName/:slug", getPostByName);
// router.get("/slugifyPosts", slugifyPosts);

router.delete("/deletePost/:id", deletePost);
router.get("/:id", getPost);

export { router as postRouter };
