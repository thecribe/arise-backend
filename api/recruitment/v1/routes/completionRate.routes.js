import express from "express";

import {
  getFormCompletionRate,
  getSingleUserCompletionRate,
} from "../controllers/completionRate.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/completion-rate/:userId",
  authMiddleware,
  getSingleUserCompletionRate,
);
router.get(
  "/completion-rate/forms/:userId",
  authMiddleware,
  getFormCompletionRate,
);

export default router;
