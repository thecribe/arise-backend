import express from "express";

import {
  deleteJobType,
  getJobType,
  updateJobType,
  uploadJobType,
} from "../controllers/jobtype.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/job-type", getJobType);
router.post(
  "/job-type",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  uploadJobType,
);
router.put(
  "/job-type",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateJobType,
);
router.delete(
  "/job-type",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  deleteJobType,
);

export default router;
