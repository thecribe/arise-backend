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
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get("/site-details", getSiteDetails);
router.put(
  "/site-details/:id",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  uploadSiteDetails,
);
router.patch(
  "/site-details/:id",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  upload.any(),
  generalUploadHandler,
  updateSiteLogo,
);
router.delete(
  "site-details/:id",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  deleteSiteLogo,
);

export default router;
