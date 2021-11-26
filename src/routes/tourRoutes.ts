import express from "express";
import { createTour, editTour } from "../controllers/tourController";
const router = express.Router();

router.post("/create", createTour);
router.patch("/edit/:id", editTour);

export { router as tourRouter };
