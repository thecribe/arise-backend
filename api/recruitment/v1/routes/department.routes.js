import express from "express";

import {
  deleteDepartment,
  getDepartment,
  updateDepartment,
  uploadDepartment,
} from "../controllers/department.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();
const { DEPARTMENT } = PERMISSIONS;

router.get("/department", getDepartment);
router.post(
  "/department",
  authMiddleware,
  authorizeRoles(DEPARTMENT.CREATE),
  uploadDepartment,
);
router.put(
  "/department",
  authMiddleware,
  authorizeRoles(DEPARTMENT.UPDATE),
  updateDepartment,
);
router.delete(
  "/department",
  authMiddleware,
  authorizeRoles(DEPARTMENT.DELETE),
  deleteDepartment,
);

export default router;
