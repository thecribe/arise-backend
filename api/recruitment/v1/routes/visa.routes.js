import express from "express";

import {
  addVisa,
  deleteVisa,
  editVisa,
  getVisa,
} from "../controllers/visa.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/visa-type", getVisa);
router.post(
  "/visa-type",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  addVisa,
);
router.put(
  "/visa-type",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  editVisa,
);
router.delete(
  "/visa-type",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  deleteVisa,
);

export default router;
