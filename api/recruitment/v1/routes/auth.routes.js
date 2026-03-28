import express from "express";
import {
  credentialAuth,
  emailAuth,
  getUserSession,
  refreshToken,
  userEmailLogin,
  userLogout,
  verifyResetPasswordToken,
} from "../controllers/auth.controller.js";
import { verifyRecaptcha } from "../middleware/recaptcha.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/auth/email", verifyRecaptcha, emailAuth);
router.post("/auth/credential", verifyRecaptcha, credentialAuth);
router.post("/auth/refresh-token", refreshToken);
router.get("/auth/session", authMiddleware, getUserSession);

//LOGIN AUTHETICATION WITH EMAIL AND TOKEN
router.get("/auth/verify-email", userEmailLogin);

//LOGOUT HANDLER
router.get("/auth/logout", authMiddleware, userLogout);

//VERIFY RESET PASSWORD

router.get("/auth/reset-password", verifyResetPasswordToken);

export default router;
