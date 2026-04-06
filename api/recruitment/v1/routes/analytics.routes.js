import express from "express";
import { getUserAllFormProgress } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/analytics/all-form-progress/:userId",
  authMiddleware,
  getUserAllFormProgress,
);

export default router;
