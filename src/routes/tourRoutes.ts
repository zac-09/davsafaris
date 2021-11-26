import express from "express";
import {
  createTour,
  editTour,
  getAllTours,
  getTour,
  getToursByCountry,
} from "../controllers/tourController";
const router = express.Router();

router.post("/create", createTour);
router.patch("/edit/:id", editTour);
router.get("/getAllTours", getAllTours);
router.get("/getAllTours/:country", getToursByCountry);

router.get("/:id", getTour);

export { router as tourRouter };
