import express from "express";
import { login, signup ,protect} from "../controllers/userController";
const router = express.Router();

router.post("/login", login);
router.post("/signup",signup);

export { router as userRouter };
