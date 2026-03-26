import express from "express";

import {
  sendEmail,
  userResetPasswordEmail,
} from "../controllers/email.controller.js";

const router = express.Router();

router.post("/email", sendEmail);

router.post("/email/reset-password", userResetPasswordEmail);

export default router;
