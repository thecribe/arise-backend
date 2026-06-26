import express from "express";

import {
  emailCronJob,
  sendEmail,
  sendReferenceEmail,
  userResetPasswordEmail,
} from "../controllers/email.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();
const { REFERENCE_MAIL } = PERMISSIONS;

router.post("/email", sendEmail);

router.post("/email/forgot-password", userResetPasswordEmail);

router.get(
  "/email/reference/:referenceId",
  authMiddleware,
  authorizeRoles(
    REFERENCE_MAIL.VIEW,
    REFERENCE_MAIL.UPLOAD,
    REFERENCE_MAIL.SEND,
  ),
  sendReferenceEmail,
);

router.get("/internal/process-email-queue", emailCronJob);

export default router;
