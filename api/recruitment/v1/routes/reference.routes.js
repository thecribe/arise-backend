import express from "express";

import {
  deleteReference,
  getReference,
  setReferenceAuditStatus,
  updateReference,
  uploadReference,
} from "../controllers/reference.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
const router = express.Router();

//ROUTES FOR REFERENCES
router.get("/reference/:userId", authMiddleware, getReference);
router.post("/reference/:userId", authMiddleware, uploadReference);
router.put("/reference/:userId", authMiddleware, updateReference);
router.delete("/reference/:referenceId", authMiddleware, deleteReference);
router.patch(
  "/reference/:userId",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  setReferenceAuditStatus,
);

export default router;
