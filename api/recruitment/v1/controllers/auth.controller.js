import e from "express";
import db from "../../../../models/index.js";
import {
  sendAuthenticationLink,
  sendEmailVerification,
} from "../email/emailHandler.js";
import { createToken, verifyToken } from "../utils/tokens.js";
import bcrypt from "bcryptjs";
import { type } from "node:os";

export const emailAuth = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.emailVerified === false) {
      const token = createToken(
        {
          id: user.id,
        },
        "30m",
      );

      if (!token) {
        return res.status(500).json({
          status: false,
          message: "Failed to send Verification email",
        });
      }

      const mailResponse = await sendEmailVerification({
        email: user.email,
        firstName: user.firstName,
        verificationToken: token,
      });

      if (mailResponse.error) {
        return res.status(500).json({
          message:
            "Error sending verification email. Please login with your email to verify your profile",
        });
      }

      return res.status(200).json({
        // ✅ ADD RETURN HERE
        status: true,
        emailVerified: false,
        message:
          "Email not verified. Please check your mail box to verify your email address",
      });
    }

    // If email is already verified, proceed with sending authetication email
    const authenticationToken = createToken(
      {
        id: user.id,
        email: user.email,
      },
      "30m",
    );
    if (!authenticationToken) {
      return res.status(500).json({
        status: false,
        message: "Failed to send Authentication email",
      });
    }

    const mailResponse = await sendAuthenticationLink({
      email: user.email,
      firstName: user.firstName,
      authenticationToken,
    });

    if (mailResponse.error) {
      return res.status(500).json({
        message:
          "Error sending authentication email. Please login with your email to verify your profile",
      });
    }
    res.status(200).json({
      status: true,
      message: "Please check your mail box for your authentication email",
    });
  } catch (error) {
    console.error("Error in emailAuth:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "REFRESH_TOKEN_MISSING" });
  }

  const decodedRefreshToken = verifyToken(refreshToken);

  if (decodedRefreshToken.valid) {
    const getUserSession = await db.Session.findOne({
      where: {
        revokedAt: null, // not revoked
        userId: decodedRefreshToken.payload.id, // belongs to the user
      },
      include: [{ model: db.User, as: "user" }],
      order: [["createdAt", "DESC"]], // most recently created first
    });

    if (!getUserSession) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No active session found" });
    }

    const validatedRefreshToken = await bcrypt.compare(
      refreshToken,
      getUserSession.refreshToken,
    );

    if (validatedRefreshToken) {
      const newAccessToken = createToken(
        {
          id: decodedRefreshToken.payload.id,
          email: getUserSession.user.email,
        },
        "1h",
      );

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      return res
        .status(200)
        .json({ message: "Access token refreshed successfully" });
    } else {
      return res
        .status(404)
        .json({ message: "Unauthorized: Invalid refresh token" });
    }
  } else {
    console.log({ decodedRefreshToken });
    return res
      .status(404)
      .json({ message: "Unauthorized: Invalid refresh token" });
  }
};

export const getUserSession = async (req, res) => {
  const user = req.user;

  try {
    const getUser = await db.User.findOne({
      where: {
        id: user.id, // belongs to the user
      },
      include: [{ model: db.Role, as: "role" }],
    });

    return res.status(200).json({
      id: getUser.id,
      email: getUser.email,
      role: getUser.role,
      name: `${getUser.firstName} ${getUser.lastName}`,
      profileImg: getUser.profileImg ? JSON.parse(getUser.profileImg) : null,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const credentialAuth = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await db.User.findOne({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
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

    // Revoke previous sessions
    await db.Session.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: user.id,
          revokedAt: null,
        },
      },
    );

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const accessToken = createToken(
      {
        id: user.id,
      },
      "1h",
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const userEmailLogin = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Authentication token is missing" });
  }

  const verification = verifyToken(token);
  if (!verification.valid) {
    return res.status(400).json({
      status: false,
      emailVerified: false,
      message: verification.expired
        ? "Authentication link has expired."
        : "Authentication link is invalid.",
    });
  }

  const refreshToken = createToken(
    {
      id: verification.payload.id,
    },
    "30d",
  );

  if (!refreshToken) {
    return res.status(500).json({
      message:
        "Error creating session token, Please login to create a new session",
    });
  }
  try {
    const encryptedToken = await bcrypt.hash(refreshToken, 10);

    // Revoke previous sessions
    await db.Session.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: verification.payload.id,
          revokedAt: null,
        },
      },
    );

    const createdSession = await db.Session.create({
      refreshToken: encryptedToken,
      userId: verification.payload.id,
    });

    if (!createdSession) {
      return res.status(500).json({
        message: "Error creating session, Please login to create a new session",
      });
    }

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const accessToken = createToken(
      {
        id: verification.payload.id,
      },
      "1h",
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error("Error in userEmailLogin:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogout = async (req, res) => {
  const user = req.user;
  try {
    await db.Session.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: user.id,
          revokedAt: null,
        },
      },
    );

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error in userLogout:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyResetPasswordToken = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: "Reset password token is missing" });
  }

  const verification = verifyToken(token);

  if (!verification.valid) {
    return res.status(400).json({
      status: false,
      message: verification.expired
        ? "Reset password link has expired."
        : "Reset password link is invalid.",
    });
  }

  try {
    const singleToken = await db.Token.findOne({
      where: {
        token: token,
      },
    });

    if (singleToken.revokedAt) {
      return res.status(400).json({
        status: false,
        message:
          "Reset password link has been revoked. Please try again to receive a new reset password link.",
      });
    }

    await db.Token.update(
      { revokedAt: new Date() },
      { where: { userId: verification.payload.id, revokedAt: null } },
    );

    res.status(200).json({
      verification,
      status: true,
      message: "Reset password token is valid",
    });
  } catch (error) {
    console.error("Error in verifyResetPasswordToken:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
