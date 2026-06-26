import express from "express";

import {
  deleteJobType,
  getJobType,
  updateJobType,
  uploadJobType,
} from "../controllers/jobtype.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();

const { JOBTYPE } = PERMISSIONS;

router.get("/job-type", getJobType);
router.post(
  "/job-type",
  authMiddleware,
  authorizeRoles(JOBTYPE.CREATE),
  uploadJobType,
);
router.put(
  "/job-type",
  authMiddleware,
  authorizeRoles(JOBTYPE.UPDATE),
  updateJobType,
);
router.delete(
  "/job-type",
  authMiddleware,
  authorizeRoles(JOBTYPE.DELETE),
  deleteJobType,
);

export default router;
