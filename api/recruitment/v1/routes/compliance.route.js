import express from "express";
import { upload } from "../utils/multerHandler.js";
import {
  allStaffCompliance,
  dbsAndRTWDocuments,
  getComplianceDocuments,
  getDBSAndRTWDocuments,
  uploadComplianceDocuments,
} from "../controllers/compliance.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();

const { COMPLIANCE } = PERMISSIONS;

router.post(
  "/compliance/documents/:staffId",
  authMiddleware,
  authorizeRoles(
    COMPLIANCE.CREATE,
    COMPLIANCE.VIEW,
    COMPLIANCE.UPDATE,
    COMPLIANCE.DELETE,
  ),
  upload.any(),
  uploadComplianceDocuments,
);
router.get(
  "/compliance/documents/:staffId",
  authMiddleware,
  authorizeRoles(
    COMPLIANCE.CREATE,
    COMPLIANCE.VIEW,
    COMPLIANCE.UPDATE,
    COMPLIANCE.DELETE,
  ),
  getComplianceDocuments,
);
router.post(
  "/compliance/dbs-and-rtw/:staffId",
  authMiddleware,
  authorizeRoles(
    COMPLIANCE.CREATE,
    COMPLIANCE.VIEW,
    COMPLIANCE.UPDATE,
    COMPLIANCE.DELETE,
  ),
  upload.any(),
  dbsAndRTWDocuments,
);
router.get(
  "/compliance/dbs-and-rtw/:staffId",
  authMiddleware,
  authorizeRoles(
    COMPLIANCE.CREATE,
    COMPLIANCE.VIEW,
    COMPLIANCE.UPDATE,
    COMPLIANCE.DELETE,
  ),
  getDBSAndRTWDocuments,
);
router.get(
  "/compliance/all-staff-complaince",
  authMiddleware,
  authorizeRoles(
    COMPLIANCE.CREATE,
    COMPLIANCE.VIEW,
    COMPLIANCE.UPDATE,
    COMPLIANCE.DELETE,
  ),
  allStaffCompliance,
);

export default router;
