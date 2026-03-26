import { Op } from "sequelize";
import db from "../../../../models/index.js";
import bcrypt from "bcryptjs";
import { createToken, verifyToken } from "../utils/tokens.js";
import { sendEmailVerification } from "../email/emailHandler.js";

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
    const [user, created] = await db.User.findOrCreate({
      where: { email: payload.email },
      defaults: {
        ...payload,
        roleSlug: body.roleSlug || "applicant",
        departmentSlug: body.departmentSlug || "uncategorised",
      },
      transaction: t,
    });

    if (!created) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "User already exists! Please login with your email" });
    }

    const verificationToken = createToken(
      {
        email: payload.email,
        id: user.id,
      },
      "30m",
    );
    if (!verificationToken) {
      return res.status(500).json({
        message:
          "Error creating verification token, Please login with your email to verify your account",
      });
    }

    payload.verificationToken = verificationToken;

    const mailResponse = await sendEmailVerification(payload);

    if (mailResponse.error) {
      return res.status(500).json({
        message:
          "Error sending verification email. Please login with your email to verify your profile",
      });
    }
    await t.commit();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ message: "Error creating user" });
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
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Error: User Id can not be empty" });
  }

  if (!body) {
    return res
      .status(400)
      .json({ message: "Error: Please send data to update user" });
  }

  try {
    const response = await db.User.update(
      { ...body },
      { where: { id: userId } },
    );
    return res
      .status(200)
      .json({ data: response, message: "User updated successfully" });
  } catch (error) {
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
    return res.status(400).json({ message: "Verification token is missing" });
  }

  try {
    const verification = verifyToken(token);
    if (!verification.valid) {
      return res.status(400).json({
        status: false,
        emailVerified: false,
        message: verification.expired
          ? "Verification link has expired."
          : "Verification link is invalid.",
      });
    }
    // Debugging log
    //IF VERICATION LINK IS VALID, UPDATE USER EMAIL VERIFIED STATUS TO TRUE

    const user = await db.User.findByPk(verification.payload.id, {
      include: [
        { model: db.Role, as: "role" },
        { model: db.Job_Type, as: "jobType" },
        { model: db.Department, as: "department" },
      ],
    });

    if (user.emailVerified) {
      return res.status(200).json({ message: "Email already verified" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [updatedUser] = await db.User.update(
      { emailVerified: true },
      { where: { id: verification.payload.id } },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const refreshToken = createToken(
      {
        id: user.id,
      },
      "30d",
    );

    if (!refreshToken) {
      return res.status(500).json({
        message:
          "Error creating session token, Please login to create a new session",
      });
    }

    const encryptedToken = await bcrypt.hash(refreshToken, 10);

    const createdSession = await db.Session.create({
      refreshToken: encryptedToken,
      userId: user.id,
    });

    if (!createdSession) {
      return res.status(500).json({
        message: "Error creating session, Please login to create a new session",
      });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
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
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error); // Log the error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userPasswordReset = async (req, res) => {
  const { token } = req.params;
  let { new_password, confirm_password } = req.body;

  new_password = new_password?.trim();
  confirm_password = confirm_password?.trim();

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token" });
  }

  if (!new_password || !confirm_password) {
    return res.status(400).json({ message: "Password fields are required" });
  }

  if (new_password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  if (new_password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  if (/\s/.test(new_password)) {
    return res.status(400).json({ message: "Password cannot contain spaces" });
  }

  const verification = verifyToken(token);
  if (!verification.valid) {
    return res.status(400).json({
      status: false,
      emailVerified: false,
      message: verification.expired
        ? "Token has expired."
        : "Token is invalid.",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(new_password, 10);
    const updatedUser = await db.User.update(
      { password: hashPassword },
      { where: { id: verification.payload.id } },
    );

    return res
      .status(200)
      .json({ message: "User password successfully updated" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
