import express from "express";
import {
  getUserAllFormProgress,
  getUserComplianceStatus,
} from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/analytics/all-form-progress/:userId",
  authMiddleware,
  getUserAllFormProgress,
);

router.get("/analytics/compliance/:userId", getUserComplianceStatus);
export default router;
