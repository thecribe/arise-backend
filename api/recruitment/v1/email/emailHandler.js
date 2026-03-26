import { Resend } from "resend";
import { authEmailTemplate } from "./authEmailTemplate.js";
import { resetPasswordTemplate } from "./generalTemplate.js";

if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (payload) => {
  let response;
  try {
    response = await resend.emails.send({
      from: "Support <info@developer.cribe.org>",
      to: payload.email,
      subject: "Email Verification",
      // react: EmailComponent({ user: payload }),
      html: `<p>Hello ${payload?.firstName},</p><p>Please click the link below to verify your email:</p><a href="http://localhost:3000/verify-email?token=${payload.verificationToken}">Verify Email</a>`,
    });
  } catch (error) {
    return { error: "Failed to send email" };
  }
  return response;
};

export const sendAuthenticationLink = async (payload) => {
  const authLink = `http://localhost:3000/authenticate?token=${payload.authenticationToken}`;
  let response;
  try {
    response = await resend.emails.send({
      from: "Support <info@developer.cribe.org>",
      to: payload.email,
      subject: "User Login Access Link",
      html: authEmailTemplate({
        name: payload.firstName,
        authLink: authLink,
      }),
    });
  } catch (error) {
    return { error: "Failed to send authentication link email" };
  }

  return response;
};

export const sendResetPasswordLink = async (payload) => {
  const resetLink = `http://localhost:3000/reset-password?token=${payload.resetToken}`;
  let response;
  try {
    response = await resend.emails.send({
      from: "Support <info@developer.cribe.org>",
      to: payload.email,
      subject: "Reset Password Link",
      html: await resetPasswordTemplate({
        title: "Reset Your Password",
        name: payload.firstName,
        content: [
          "Please click the button below to reset your password.",
          `<a href=${resetLink}
                     style="display:inline-block;padding:14px 28px;
                     background:#111827;color:#ffffff;
                     text-decoration:none;border-radius:6px;
                     font-weight:bold;">
                     Reset Password
                  </a>`,
        ],
      }),
    });
  } catch (error) {
    console.error("Error sending reset password link email:", error);
    return { error: "Failed to send reset password link email" };
  }

  return response;
};
