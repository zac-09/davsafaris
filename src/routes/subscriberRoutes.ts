import express from "express";
import {
  createSubscriber,
  deleteSubscriber,
  getAllSubscribers,
  getSubscriber,
  updateSubscriber,
} from "../controllers/subscriberController";
const router = express.Router();

router.post("/create", createSubscriber);
router.patch("/updateSubscriber/:id", updateSubscriber);
router.get("/getAllSubscribers", getAllSubscribers);
router.delete("/deleteSubscriber/:id", deleteSubscriber);
router.get("/:id", getSubscriber);

export { router as subscriberRouter };
