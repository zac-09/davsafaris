import express from "express";
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  updateBooking,
} from "../controllers/bookingController";
const router = express.Router();

router.post("/create", createBooking);
router.patch("/updateBooking/:id", updateBooking);
router.get("/getAllBookings", getAllBookings);
router.delete("/deleteBooking/:id", deleteBooking);
router.get("/:id", getBooking);

export { router as bookingRouter };
