import express from "express";

import {
  addVisa,
  deleteVisa,
  editVisa,
  getVisa,
} from "../controllers/visa.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();
const { JOBTYPE } = PERMISSIONS;

router.get("/visa-type", getVisa);
router.post(
  "/visa-type",
  authMiddleware,
  authorizeRoles(JOBTYPE.CREATE),
  addVisa,
);
router.put(
  "/visa-type",
  authMiddleware,
  authorizeRoles(JOBTYPE.UPDATE),
  editVisa,
);
router.delete(
  "/visa-type",
  authMiddleware,
  authorizeRoles(JOBTYPE.DELETE),
  deleteVisa,
);

export default router;
