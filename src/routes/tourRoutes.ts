import express from "express";
import { uploadFile , uploadFiles} from "../controllers/fileController";
import {
  createTour,
  deleteTour,
  editTour,
  getAllTours,
  getTour,
  getTourByName,
  getToursByCountry,
  uploadTourImages,
} from "../controllers/tourController";
import { reviewRouter } from "./reviewRoutes";
const router = express.Router();
router.use("/:id/reviews", reviewRouter);

router.post("/create",uploadFile, createTour);
router.patch("/updateTour/:id", uploadFile,editTour);
router.post("/uploadTourImages/:id",uploadFiles, uploadTourImages);
router.get("/getAllTours", getAllTours);
router.get("/getAllTours/:country", getToursByCountry);
router.get("/getTourByName/:slug", getTourByName);

router.delete("/deleteTour/:id", deleteTour);
router.get("/:id", getTour);

export { router as tourRouter };
