import express from "express";
import {
  deleteSiteLogo,
  getSiteDetails,
  updateSiteLogo,
  uploadSiteDetails,
} from "../controllers/sitedetails.controller.js";
import { generalUploadHandler } from "../controllers/fileUpload.controller.js";
import { upload } from "../utils/multerHandler.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();
const { SITE_DETAILS } = PERMISSIONS;

router.get("/site-details", getSiteDetails);
router.put(
  "/site-details/:id",
  authMiddleware,
  authorizeRoles(SITE_DETAILS.CREATE, SITE_DETAILS.UPDATE),
  uploadSiteDetails,
);
router.patch(
  "/site-details/:id",
  authMiddleware,
  authorizeRoles(SITE_DETAILS.UPDATE, SITE_DETAILS.CREATE),
  upload.any(),
  generalUploadHandler,
  updateSiteLogo,
);
router.delete(
  "site-details/:id",
  authMiddleware,
  authorizeRoles(SITE_DETAILS.DELETE, SITE_DETAILS.UPDATE),
  deleteSiteLogo,
);

export default router;
