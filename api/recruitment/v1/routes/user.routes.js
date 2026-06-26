import express from "express";
import {
  addUser,
  adminUserAdd,
  changeUserPassword,
  changeUserRole,
  editSingleUser,
  getSingleUser,
  getUsers,
  setUserPassword,
  userPasswordReset,
  verifyUserEmail,
} from "../controllers/user.controller.js";
import { verifyRecaptcha } from "../middleware/recaptcha.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";
import { upload } from "../utils/multerHandler.js";
import { generalUploadHandler } from "../controllers/fileUpload.controller.js";

const router = express.Router();
const { USER } = PERMISSIONS;
//PUBLIC ROUTES
router.post("/users", verifyRecaptcha, addUser);
//TOKEN USER VERIFICATION
router.get("/verify-email", verifyUserEmail);

//PASSWORD RESET
router.put("/reset-password/:userId", userPasswordReset);
router.put("/set-password/:token", setUserPassword);

//PRIVATE ROUTE

router.get("/users", authMiddleware, authorizeRoles(USER.VIEW), getUsers);
router.post(
  "/admin/add-user",
  authMiddleware,
  authorizeRoles(USER.CREATE),
  adminUserAdd,
);

//SINGLE USER
router.get(
  "/users/:userId",
  authMiddleware,
  authorizeRoles(USER.VIEW),
  getSingleUser,
);
router.put(
  "/users/:userId",
  authMiddleware,
  authorizeRoles(USER.CREATE, USER.UPDATE),
  upload.any(),
  generalUploadHandler,
  editSingleUser,
);
router.put(
  "/users/:userId/change-role",
  authMiddleware,
  authorizeRoles(USER.CREATE, USER.UPDATE),
  changeUserRole,
);
router.put(
  "/users/:userId/change-password",
  authMiddleware,
  authorizeRoles(USER.CREATE, USER.UPDATE),
  changeUserPassword,
);

export default router;
