import { type } from "node:os";
import db from "../../../../models/index.js";
import { createToken, verifyToken } from "../utils/tokens.js";
import {
  sendRefereeEmail,
  sendResetPasswordLink,
} from "../email/emailHandler.js";
import bcrypt from "bcryptjs";

export const sendEmail = async (req, res) => {
  const { email, payload } = req.body;

  // const response = await sendEmailVerification(email, payload);

  const token = createToken(
    {
      email: payload.firstname,
    },
    "30m",
  );
  if (!token) {
    return res.status(500).json({
      status: false,
      message: "Failed to send email",
    });
  }

  const verification = verifyToken(token);

  if (!verification.valid) {
    return res.status(400).json({
      status: false,
      verification,
      message: "Failed to verify token",
    });
  }

  res.status(200).json({
    verification,
    status: true,
    message: "Email sent successfully",
  });
};

export const userResetPasswordEmail = async (req, res) => {
  const id = req.body.userId;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await db.User.findOne({ where: { id } });

    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({
        message:
          "Email not verified. Please verify your email before resetting password",
      });
    }

    const resetToken = createToken(
      {
        id: user.id,
      },
      "15m",
    );

    if (!resetToken) {
      return res.status(500).json({
        status: false,
        message: "Failed to send reset password email",
      });
    }

    const t = await db.sequelize.transaction();

    await db.Token.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: user.id,
          type: "password_reset",
          revokedAt: null,
        },
        transaction: t,
      },
    );

    await db.Token.create(
      {
        token: resetToken,
        userId: user.id,
        type: "password_reset",
      },
      {
        transaction: t,
      },
    );

    const mailResponse = await sendResetPasswordLink({
      email: user.email,
      firstName: user.firstName,
      resetToken,
    });
    if (mailResponse.error) {
      await t.rollback();
      return res
        .status(500)
        .json({ message: "Failed to send reset password email" });
    }

    await t.commit();

    res.status(200).json({
      status: true,
      message: "Reset password email sent successfully",
    });
  } catch (error) {
    await t.rollback();
    console.error("Error in userResetPasswordEmail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const sendReferenceEmail = async (req, res) => {
  const { referenceId } = req.params;

  if (!referenceId) {
    return res.status(400).json({ message: "Reference ID is required" });
  }

  try {
    const reference = await db.Reference.findOne({
      where: { id: referenceId },
    });

    if (!reference) {
      return res.status(400).json({ message: "Invalid reference ID" });
    }

    const getUser = await db.User.findOne({
      where: { id: reference.userId },
      attributes: ["firstName", "lastName"],
    });

    if (!getUser) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updateReferencetoken = await db.Token.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: reference.userId,
          type: "reference",
          revokedAt: null,
        },
      },
    );

    //CREATE TOKEN FOR REFERENCE
    const refereeToken = createToken(
      { referenceId, userId: reference.userId },
      "30d",
    );

    await db.Token.create({
      token: refereeToken,
      userId: reference.userId,
      type: "reference",
    });

    const mailresponse = await sendRefereeEmail({
      applicantName: `${getUser.firstName} ${getUser.lastName}`,
      email: reference.referee_email,
      refereeToken: refereeToken,
      yourFullName: "Arise Nursing Recruitment Team",
    });
    if (mailresponse.error) {
      return res
        .status(500)
        .json({ message: "Failed to send reference email" });
    }

    const mailStatus = await db.ReferenceMailStatus.findOne({
      where: { referenceId },
    });

    if (mailStatus) {
      await db.ReferenceMailStatus.update(
        { status: "pending" },
        { where: { referenceId } },
      );
    } else {
      await db.ReferenceMailStatus.create({ status: "pending", referenceId });
    }

    res.status(200).json({
      status: true,
      message: "Reference email sent successfully",
    });
  } catch (error) {
    console.error("Error in sendReferenceEmail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
