import express from "express";
import {
  deleteMandatoryCertificate,
  deleteUserCertificate,
  getMandatoryCertificate,
  getUserCertificate,
  setAuditStatus,
  updateMandatoryCertificate,
  updateSingleCertificate,
  updateUserCertificate,
  uploadMandatoryCertificate,
  uploadUserCertificate,
} from "../controllers/training.controller.js";
import { screeningUploadHandler } from "../controllers/fileUpload.controller.js";
import { upload } from "../utils/multerHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();
const { CERTIFICATE, APPLICATION_FORM } = PERMISSIONS;

//EACH APPLICANT AUDIT STATUS
router.patch(
  "/training/audit-status/:userId",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  setAuditStatus,
);

//SINGLE CERTIFICATES ROUTES HANDLER
router.get("/training/certificate/:userId", authMiddleware, getUserCertificate);
router.post(
  "/training/certificate/:userId",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadUserCertificate,
);
router.put(
  "/training/certificate/:userId",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  updateUserCertificate,
);
router.patch(
  "/training/certificate/:certificateId",
  authMiddleware,
  updateSingleCertificate,
);
router.delete(
  "/training/certificate/:certificateId",
  authMiddleware,
  deleteUserCertificate,
);

//ROUTES FOR MANDATORY CERTIFICATES
router.get(
  "/training/mandatory-certificate",
  authMiddleware,
  getMandatoryCertificate,
);
router.post(
  "/training/mandatory-certificate",
  authMiddleware,
  authorizeRoles(CERTIFICATE.CREATE),
  uploadMandatoryCertificate,
);
router.put(
  "/training/mandatory-certificate/:certificateId",
  authMiddleware,
  authorizeRoles(CERTIFICATE.UPDATE),
  updateMandatoryCertificate,
);
router.delete(
  "/training/mandatory-certificate/:certificateId",
  authMiddleware,
  authorizeRoles(CERTIFICATE.DELETE),
  deleteMandatoryCertificate,
);

export default router;
