import express from "express";
import {
  addRole,
  deleteRole,
  getPermission,
  getRole,
  uploadPermissions,
} from "../controllers/role.controller.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

const { ROLE } = PERMISSIONS;

router.get("/roles", authMiddleware, getRole);
router.post(
  "/roles",
  authMiddleware,
  // authorizeRoles(ROLE.CREATE),
  authorizeRoles(),
  addRole,
);
router.post(
  "/roles/:roleSlug/permissions",
  authMiddleware,
  // authorizeRoles(ROLE.UPDATE),
  authorizeRoles(),
  uploadPermissions,
);
router.delete(
  "/roles/:roleSlug",
  authMiddleware,
  // authorizeRoles(ROLE.DELETE),
  authorizeRoles(),
  deleteRole,
);

//PERMISSIONS
router.get(
  "/permissions",
  authMiddleware,
  // authorizeRoles(ROLE.VIEW, ROLE.CREATE, ROLE.UPDATE, ROLE.DELETE),
  authorizeRoles(),
  getPermission,
);

export default router;
