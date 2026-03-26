import express from "express";
import {
  addUser,
  changeUserPassword,
  changeUserRole,
  editSingleUser,
  getSingleUser,
  getUsers,
  userPasswordReset,
  verifyUserEmail,
} from "../controllers/user.controller.js";
import { verifyRecaptcha } from "../middleware/recaptcha.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.get(
  "/users",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  getUsers,
);
router.post("/users", verifyRecaptcha, addUser);

//SINGLE USER
router.get("/users/:userId", authMiddleware, getSingleUser);
router.put("/users/:userId", authMiddleware, editSingleUser);
router.put(
  "/users/:userId/change-role",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  changeUserRole,
);
router.put(
  "/users/:userId/change-password",
  authMiddleware,
  changeUserPassword,
);

//TOKEN USER VERIFICATION
router.get("/verify-email", verifyUserEmail);

//PASSWORD RESET
router.put("/reset-password/:token", userPasswordReset);

export default router;
