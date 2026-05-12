import express from "express";

import {
  sendEmail,
  sendReferenceEmail,
  userResetPasswordEmail,
} from "../controllers/email.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/email", sendEmail);

router.post("/email/reset-password", userResetPasswordEmail);

router.get(
  "/email/reference/:referenceId",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  sendReferenceEmail,
);

export default router;
