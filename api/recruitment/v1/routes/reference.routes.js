import express from "express";

import {
  adminRefererenceUpload,
  approveReferenceResponse,
  deleteReference,
  getReference,
  getReferenceResponse,
  setReferenceAuditStatus,
  updateReference,
  uploadApplicantReference,
  uploadReference,
  veriftyRefereeToken,
} from "../controllers/reference.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { upload } from "../utils/multerHandler.js";
import { generalUploadHandler } from "../controllers/fileUpload.controller.js";
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

router.get("/reference/verify-referee-token/:token", veriftyRefereeToken);

//Handle file upload for reference
router.post(
  "/reference/upload/:referenceId",
  upload.any(),
  generalUploadHandler,
  uploadApplicantReference,
);

router.get(
  "/reference/response/:referenceId",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  getReferenceResponse,
);

router.get(
  "/reference/response/status/:referenceId",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  approveReferenceResponse,
);
router.get(
  "/reference/response/upload/:referenceId",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  adminRefererenceUpload,
);
export default router;
