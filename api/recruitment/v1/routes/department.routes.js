import express from "express";

import {
  deleteDepartment,
  getDepartment,
  updateDepartment,
  uploadDepartment,
} from "../controllers/department.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/department", getDepartment);
router.post(
  "/department",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  uploadDepartment,
);
router.put(
  "/department",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateDepartment,
);
router.delete(
  "/department",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  deleteDepartment,
);

export default router;
