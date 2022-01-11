import express from "express";
import { uploadFile } from "../controllers/fileController";
import {
  createTour,
  deleteTour,
  editTour,
  getAllTours,
  getTour,
  getTourByName,
  getToursByCountry,
} from "../controllers/tourController";
const router = express.Router();

router.post("/create",uploadFile, createTour);
router.patch("/updateTour/:id", editTour);
router.get("/getAllTours", getAllTours);
router.get("/getAllTours/:country", getToursByCountry);
router.get("/getTourByName/:slug", getTourByName);

router.delete("/deleteTour/:id", deleteTour);
router.get("/:id", getTour);

export { router as tourRouter };
