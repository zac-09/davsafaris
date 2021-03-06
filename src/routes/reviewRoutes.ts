import express from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  updateReview,
} from "../controllers/reviewContoller";
import { protect } from "../controllers/userController";
const router = express.Router({ mergeParams: true });

router.post("/create", createReview);
router.patch("/updateReview/:id", updateReview);
router.get("/getAllReviews", getAllReviews);

router.delete("/deleteReview/:id", deleteReview);
router.get("/:id", getReview);

export { router as reviewRouter };
