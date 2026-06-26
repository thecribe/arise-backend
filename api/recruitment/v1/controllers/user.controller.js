import { Op } from "sequelize";
import db from "../../../../models/index.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/tokens.js";
import { sendEmailVerification } from "../email/emailHandler.js";
import { mergeUploadFilestoJson } from "../utils/generalUtils.js";
import { processSingleEmailJob } from "../services/emailQueue.service.js";
import { sendEmailWithFallback } from "../services/sendEmailWithFallback.js";

export const getUsers = async (req, res) => {
  const { limit, offset, department, job_type, type } = req.query;

  if (!type) {
    return res.status(400).json({ message: "Please specify type" });
  }
  //  Build WHERE dynamically
  const where = {};

  if (type === "recruitment") {
    where.roleSlug = "applicant";
  } else if (type === "staff") {
    where.roleSlug = {
      [Op.notIn]: ["super_administrator", "applicant"],
    };
  }

  if (department?.trim() && department !== "all") {
    where.departmentSlug = department;
  }
  if (job_type?.trim() && job_type !== "all") {
    where.jobTypeSlug = job_type;
  }

  try {
    const { rows, count } = await db.User.findAndCountAll({
      include: [
        { model: db.Role, as: "role" },
        { model: db.Job_Type, as: "jobType" },
        { model: db.Department, as: "department" },
      ],
      where,
      limit: Math.min(Number(limit) || 10, 100), // prevent large query
      offset: Number(offset) || 0,
      attributes: {
        exclude: ["password"],
      },
      order: [["createdAt", "ASC"]],
    });

    if (!rows) {
      return res.status(400).json({ message: "Unable to get user" });
    }

    return res.status(200).json({ data: rows, count });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addUser = async (req, res) => {
  const body = req.body;
  const t = await db.sequelize.transaction();

  try {
    const payload = {
      address: body.address,
      phone: body.phone.trim(),
      email: body.email.trim().toLowerCase(),
      firstName: body.firstName.trim(),
      lastName: body.lastName.trim(),
    };

    let user = await db.User.findOne({
      where: {
        email: payload.email,
      },
      transaction: t,
    });

    /**
     * User already exists
     */
    if (user) {
      /**
       * Email already verified
       */
      if (user.emailVerified) {
        await t.rollback();

        return res.status(400).json({
          status: false,
          message: "An account with this email already exists. Please log in.",
        });
      }

      /**
       * User exists but has not verified email.
       * Revoke previous verification tokens.
       */
      await db.Token.update(
        {
          revokedAt: new Date(),
        },
        {
          where: {
            userId: user.id,
            type: "verify-email",
            revokedAt: null,
          },
          transaction: t,
        },
      );

      const verificationToken = createToken(
        {
          id: user.id,
          email: user.email,
        },
        "30m",
      );

      if (!verificationToken) {
        await t.rollback();

        return res.status(500).json({
          message: "Error creating verification token",
        });
      }

      await db.Token.create(
        {
          token: verificationToken,
          type: "verify-email",
          userId: user.id,
        },
        {
          transaction: t,
        },
      );

      const emailJob = await db.EmailQueues.create(
        {
          type: "verify-email",
          payload: {
            email: user.email,
            firstName: user.firstName,
            verificationToken,
          },
        },
        {
          transaction: t,
        },
      );
      console.log({ emailJob });
      await t.commit();

      setImmediate(() => {
        sendEmailWithFallback(emailJob.id);
      });

      return res.status(200).json({
        status: true,
        emailVerified: false,
        message:
          "Your account already exists but your email has not been verified. A new verification email has been sent.",
      });
    }

    /**
     * Create new user
     */
    user = await db.User.create(
      {
        ...payload,
        roleSlug: body.roleSlug || "applicant",
        departmentSlug: body.departmentSlug || "uncategorised",
      },
      {
        transaction: t,
      },
    );

    const verificationToken = createToken(
      {
        id: user.id,
        email: user.email,
      },
      "30m",
    );

    if (!verificationToken) {
      await t.rollback();

      return res.status(500).json({
        message: "Error creating verification token",
      });
    }

    await db.Token.create(
      {
        token: verificationToken,
        type: "verify-email",
        userId: user.id,
      },
      {
        transaction: t,
      },
    );

    const emailJob = await db.EmailQueues.create(
      {
        type: "verify-email",
        payload: {
          email: user.email,
          firstName: user.firstName,
          verificationToken,
        },
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    setImmediate(() => {
      sendEmailWithFallback(emailJob.id);
    });

    return res.status(201).json({
      status: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);

    if (!t.finished) {
      await t.rollback();
    }

    return res.status(500).json({
      message: "Error creating user",
    });
  }
};

//SINGLE USER CONTROLER

export const getSingleUser = async (req, res) => {
  const { userId } = req.params;

  const where = {
    id: userId,
  };
  if (!userId) {
    return res.status(400).json({ message: "Error: User Id can not be empty" });
  }
  try {
    const user = await db.User.findOne({
      include: [
        { model: db.Role, as: "role" },
        { model: db.Job_Type, as: "jobType" },
        { model: db.Department, as: "department" },
      ],
      where,
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res
        .status(400)
        .json(
          { message: `User with id '${userId}' does not exist` },
          { status: 400 },
        );
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const editSingleUser = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Error: User Id can not be empty" });
  }

  if (!body) {
    return res
      .status(400)
      .json({ message: "Error: Please send data to update user" });
  }

  let payload = Object.fromEntries(
    Object.entries(body).map(([key, value]) => {
      if (typeof value === "string") {
        value = value.trim();
      }

      if (key === "email" && typeof value === "string") {
        value = value.toLowerCase();
      }

      return [key, value];
    }),
  );

  if (uploadedFiles?.profileImage) {
    payload.profileImage = mergeUploadFilestoJson(
      "[]",
      uploadedFiles.profileImage,
    );
  }

  try {
    const response = await db.User.update(
      { ...payload },
      { where: { id: userId } },
    );
    return res
      .status(200)
      .json({ data: response, message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export const changeUserRole = async (req, res) => {
  const { userId } = req.params;
  const { roleSlug } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "Error: User Id can not be empty" });
  }

  try {
    const response = await db.User.update(
      { roleSlug },
      { where: { id: userId } },
    );
    return res
      .status(200)
      .json({ data: response, message: "User role updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error: Failed to update user role" });
  }
};

export const changeUserPassword = async (req, res) => {
  const { userId } = req.params;

  const { current_password, new_password, confirm_password } = req.body;
  if (new_password !== confirm_password) {
    return res
      .status(400)
      .json({ message: "New password and confirm password do not match" });
  }
  try {
    const user = await db.User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    if (
      current_password === "generate_random_password" &&
      (!user.password || user.password.length === 0)
    ) {
      const hashPassword = await bcrypt.hash(new_password, 10);

      const updatedUser = await db.User.update(
        { password: hashPassword },
        { where: { id: userId } },
      );
      return res
        .status(200)
        .json({ message: "User password successfully updated" });
    }

    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashPassword = await bcrypt.hash(new_password, 10);

    const updatedUser = await db.User.update(
      { password: hashPassword },
      { where: { id: userId } },
    );
    return res
      .status(200)
      .json({ message: "User password successfully updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyUserEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({
      message: "Verification token is missing",
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const verification = verifyToken(token);

    if (!verification.valid) {
      await t.rollback();

      return res.status(400).json({
        status: false,
        emailVerified: false,
        message: verification.expired
          ? "Verification link has expired."
          : "Verification link is invalid.",
      });
    }

    const storedToken = await db.Token.findOne({
      where: {
        token,
        type: "verify-email",
        userId: verification.payload.id,
        revokedAt: null,
      },
      transaction: t,
    });

    if (!storedToken) {
      await t.rollback();

      return res.status(400).json({
        message: "Verification token has already been used or is invalid",
      });
    }

    const user = await db.User.findByPk(verification.payload.id, {
      include: [
        {
          model: db.Role,
          as: "role",
        },
        {
          model: db.Job_Type,
          as: "jobType",
        },
        {
          model: db.Department,
          as: "department",
        },
      ],
      transaction: t,
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.emailVerified) {
      await t.rollback();

      return res.status(200).json({
        message: "Email already verified",
        userId: user.id,
      });
    }

    await user.update(
      {
        emailVerified: true,
      },
      {
        transaction: t,
      },
    );

    // Revoke ALL active verification tokens
    await db.Token.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          type: "verify-email",
          userId: user.id,
          revokedAt: null,
        },
        transaction: t,
      },
    );

    const setupPasswordToken = createToken(
      {
        userId: user.id,
      },
      "15m",
    );

    if (!setupPasswordToken) {
      await t.rollback();

      return res.status(500).json({
        message: "Failed to create setup password token",
      });
    }
    await db.Token.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          type: "setup-password",
          userId: user.id,
          revokedAt: null,
        },
        transaction: t,
      },
    );
    await db.Token.create(
      {
        token: setupPasswordToken,
        type: "setup-password",
        userId: user.id,
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    return res.status(200).json({
      message: "Email verified successfully",
      emailVerified: true,
      userId: user.id,
      setupPasswordToken,
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    console.error("Error verifying email:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const setUserPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirm_password } = req.body;

  if (!token) {
    return res.status(400).json({
      message: "Setup token is required",
    });
  }

  if (!password || !confirm_password) {
    return res.status(400).json({
      message: "Password and confirmation password are required",
    });
  }

  if (password !== confirm_password) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  /**
   * Industry-standard password policy
   */
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character",
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const verification = verifyToken(token);

    if (!verification.valid) {
      await t.rollback();

      return res.status(400).json({
        status: false,
        message: verification.expired
          ? "Password setup link has expired."
          : "Password setup link is invalid.",
      });
    }

    const storedToken = await db.Token.findOne({
      where: {
        token,
        type: "setup-password",
        userId: verification.payload.userId,
        revokedAt: null,
      },
      transaction: t,
    });

    if (!storedToken) {
      await t.rollback();

      return res.status(400).json({
        message: "Password setup token has already been used or is invalid",
      });
    }

    const user = await db.User.findByPk(verification.payload.userId, {
      transaction: t,
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        message: "User not found",
      });
    }

    /**
     * Optional:
     * Prevent password being set twice.
     */
    if (user.password) {
      await t.rollback();

      return res.status(400).json({
        message: "Password has already been configured",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update(
      {
        password: hashedPassword,
      },
      {
        transaction: t,
      },
    );

    /**
     * Revoke setup password token
     */
    await storedToken.update(
      {
        revokedAt: new Date(),
      },
      {
        transaction: t,
      },
    );

    /**
     * Create session
     */
    const refreshToken = createToken(
      {
        id: user.id,
      },
      "30d",
    );

    if (!refreshToken) {
      await t.rollback();

      return res.status(500).json({
        message: "Error creating session token. Please login again.",
      });
    }
    const encryptedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await db.Session.create(
      {
        refreshToken: encryptedRefreshToken,
        userId: user.id,
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    /**
     * Login user immediately
     */
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    const accessToken = createToken(
      {
        id: user.id,
        email: user.email,
      },
      "1h",
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: true,
      message: "Password created successfully",
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    console.error("Password setup error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const userPasswordReset = async (req, res) => {
  const { userId } = req.params;
  const { new_password, confirm_password } = req.body;

  const password = new_password?.trim();
  const confirmPassword = confirm_password?.trim();

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  if (!password || !confirmPassword) {
    return res.status(400).json({
      message: "Password fields are required",
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      message: "Passwords do not match",
    });
  }

  // Same policy used in setup password
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter and one number",
    });
  }

  if (/\s/.test(password)) {
    return res.status(400).json({
      message: "Password cannot contain spaces",
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const user = await db.User.findByPk(userId, {
      transaction: t,
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        message: "User not found",
      });
    }

    // Optional: Prevent reusing the current password
    if (user.password) {
      const isSamePassword = await bcrypt.compare(password, user.password);

      if (isSamePassword) {
        await t.rollback();

        return res.status(400).json({
          message: "New password must be different from your current password",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await user.update(
      {
        password: hashedPassword,
      },
      {
        transaction: t,
      },
    );

    await t.commit();

    return res.status(200).json({
      status: true,
      message: "Password successfully updated",
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    console.error("Password reset error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const adminUserAdd = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      departmentSlug,
      jobTypeSlug,
      password,
    } = req.body;

    // CHECK FOR EMPTY FIELDS
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !departmentSlug ||
      !jobTypeSlug ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // CHECK IF EMAIL ALREADY EXISTS
    const existingUser = await db.User.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    // CREATE USER
    const newUser = await db.User.create({
      firstName,
      lastName,
      email,
      phone,
      departmentSlug,
      jobTypeSlug,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
