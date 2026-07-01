import db from "../../../../models/index.js";
import { createToken, verifyToken } from "../utils/tokens.js";
import {
  sendRefereeEmail,
  sendResetPasswordLink,
} from "../email/emailHandler.js";
import bcrypt from "bcryptjs";
import { processEmailQueue } from "../services/emailQueue.service.js";
import { sendEmailWithFallback } from "../services/sendEmailWithFallback.js";

export const emailCronJob = async (req, res) => {
  if (req.headers["x-cron-secret"] !== process.env.CRON_SECRET) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  await processEmailQueue();

  return res.status(200).json({
    message: "Queue processed",
  });
};
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
  const { email } = req.body;

  if (!email?.trim()) {
    return res.status(400).json({
      message: "Email is required",
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const user = await db.User.findOne({
      where: {
        email: email.trim().toLowerCase(),
      },
      transaction: t,
    });

    /**
     * Don't reveal whether the email exists.
     */
    if (!user) {
      await t.rollback();

      return res.status(200).json({
        message:
          "If an account exists with this email address, a password reset link has been sent.",
      });
    }

    /**
     * Optional:
     * Revoke previous active reset tokens
     */
    await db.Token.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          userId: user.id,
          type: "reset-password",
          revokedAt: null,
        },
        transaction: t,
      },
    );

    const resetPasswordToken = createToken(
      {
        userId: user.id,
        email: user.email,
      },
      "30m",
    );

    if (!resetPasswordToken) {
      await t.rollback();

      return res.status(500).json({
        message: "Failed to create reset token",
      });
    }

    await db.Token.create(
      {
        token: resetPasswordToken,
        type: "reset-password",
        userId: user.id,
      },
      {
        transaction: t,
      },
    );

    const emailJob = await db.EmailQueues.create(
      {
        type: "reset-password",

        payload: {
          email: user.email,
          firstName: user.firstName,
          resetPasswordToken,
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

    return res.status(200).json({
      message:
        "If an account exists with this email address, a password reset link has been sent.",
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const sendReferenceEmail = async (req, res) => {
  const { referenceId } = req.params;

  if (!referenceId) {
    return res.status(400).json({
      message: "Reference ID is required",
    });
  }

  const t = await db.sequelize.transaction();

  try {
    const reference = await db.Reference.findByPk(referenceId, {
      transaction: t,
    });

    if (!reference) {
      await t.rollback();

      return res.status(404).json({
        message: "Reference not found",
      });
    }

    const user = await db.User.findByPk(reference.userId, {
      attributes: ["id", "firstName", "lastName", "email"],
      transaction: t,
    });

    if (!user) {
      await t.rollback();

      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    /**
     * Revoke previous active reference tokens
     */
    await db.Token.update(
      {
        revokedAt: new Date(),
      },
      {
        where: {
          userId: reference.userId,
          type: "reference",
          revokedAt: null,
        },
        transaction: t,
      },
    );

    /**
     * Create new reference token
     */
    const refereeToken = createToken(
      {
        referenceId: reference.id,
        userId: reference.userId,
      },
      "30d",
    );

    if (!refereeToken) {
      await t.rollback();

      return res.status(500).json({
        message: "Failed to generate reference token",
      });
    }

    await db.Token.create(
      {
        token: refereeToken,
        userId: reference.userId,
        type: "reference",
      },
      {
        transaction: t,
      },
    );

    /**
     * Create Email Queue Job
     */
    const emailJob = await db.EmailQueues.create(
      {
        type: "reference",

        payload: {
          applicantName: `${user.firstName} ${user.lastName}`,
          email: reference.referee_email,
          refereeName: reference.referee_name,
          refereeToken,
          yourFullName: "Arise Nursing Recruitment Team",
        },
      },
      {
        transaction: t,
      },
    );

    /**
     * Update mail status
     */
    const mailStatus = await db.ReferenceMailStatus.findOne({
      where: {
        referenceId,
      },
      transaction: t,
    });

    if (mailStatus) {
      await mailStatus.update(
        {
          status: "pending",
        },
        {
          transaction: t,
        },
      );
    } else {
      await db.ReferenceMailStatus.create(
        {
          referenceId,
          status: "pending",
        },
        {
          transaction: t,
        },
      );
    }

    await t.commit();

    /**
     * Attempt immediate send.
     * If it fails, the queue will retry automatically.
     */
    setImmediate(() => {
      sendEmailWithFallback(emailJob.id);
    });

    return res.status(200).json({
      status: true,
      message: "Reference email sent successfully",
    });
  } catch (error) {
    if (!t.finished) {
      await t.rollback();
    }

    console.error("Error sending reference email:", error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};
