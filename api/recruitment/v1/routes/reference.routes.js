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
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";
import { upload } from "../utils/multerHandler.js";
import { generalUploadHandler } from "../controllers/fileUpload.controller.js";
const router = express.Router();
const { REFERENCE, REFERENCE_MAIL, APPLICATION_FORM } = PERMISSIONS;

//ROUTES FOR REFERENCES
router.get(
  "/reference/:userId",
  authMiddleware,
  authorizeRoles(REFERENCE.VIEW),
  getReference,
);
router.post(
  "/reference/:userId",
  authMiddleware,
  authorizeRoles(REFERENCE.CREATE),
  uploadReference,
);
router.put(
  "/reference/:userId",
  authMiddleware,
  authorizeRoles(REFERENCE.UPDATE),
  updateReference,
);
router.delete(
  "/reference/:referenceId",
  authMiddleware,
  authorizeRoles(REFERENCE.DELETE),
  deleteReference,
);
router.patch(
  "/reference/:userId",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  setReferenceAuditStatus,
);

//REFERENCE RESPONSE ROUTE
router.get(
  "/reference/response/:referenceId",
  authMiddleware,
  authorizeRoles(REFERENCE_MAIL.VIEW),
  getReferenceResponse,
);

router.get(
  "/reference/response/status/:referenceId",
  authMiddleware,
  authorizeRoles(REFERENCE_MAIL.VIEW),
  approveReferenceResponse,
);
router.get(
  "/reference/response/upload/:referenceId",
  authMiddleware,
  authorizeRoles(REFERENCE_MAIL.VIEW),
  adminRefererenceUpload,
);

//PUBLIC ROUTES
router.get("/reference/verify-referee-token/:token", veriftyRefereeToken);
//Handle file upload for reference
router.post(
  "/reference/upload/:referenceId",
  upload.any(),
  generalUploadHandler,
  uploadApplicantReference,
);

export default router;
