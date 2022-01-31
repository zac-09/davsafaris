import express from "express";
import {
  contactUs,
  createSubscriber,
  deleteSubscriber,
  getAllSubscribers,
  getSubscriber,
  joinNewsLetter,
  unsubscribeNewsLetter,
  updateSubscriber,
} from "../controllers/subscriberController";
const router = express.Router();

router.post("/create", createSubscriber);
router.patch("/updateSubscriber/:id", updateSubscriber);
router.get("/getAllSubscribers", getAllSubscribers); 
router.get("/unsubscribe/:email", unsubscribeNewsLetter);
router.post("/joinNewsLetter", joinNewsLetter);
router.post("/contactUs", contactUs);
router.delete("/deleteSubscriber/:id", deleteSubscriber);
router.get("/:id", getSubscriber);

export { router as subscriberRouter };
