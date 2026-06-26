import { Resend } from "resend";
import { authEmailTemplate } from "./authEmailTemplate.js";
import { resetPasswordTemplate } from "./generalTemplate.js";
import {
  createReferenceEmailHTML,
  createReferenceEmailText,
} from "./referenceEmailTemplate.js";
import {
  createForgotPasswordEmailHTML,
  createForgotPasswordEmailText,
} from "./forgotPasswordTemplate.js";
import {
  createEmailVerificationHTML,
  createEmailVerificationText,
} from "./verifyEmailTemplate.js";

// 👇 Load dotenv ONLY in development
// if (process.env.NODE_ENV !== "production") {
//   const dotenv = await import("dotenv");
//   dotenv.config({ path: ".env" });
// }
if (!process.env.RESEND_API_KEY) {
  throw new Error("RESEND_API_KEY is missing");
}

if (!process.env.FRONTENDURL) {
  throw new Error("Domain is missing");
}

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmailVerification = async (payload) => {
  const verificationLink = `${process.env.FRONTENDURL}/verify-email?token=${payload.verificationToken}`;
  return await resend.emails.send({
    from: "Support <info@developer.cribe.org>",
    to: payload.email,
    subject: "Email Verification",
    html: createEmailVerificationHTML({ ...payload, verificationLink }),
    text: createEmailVerificationText({ ...payload, verificationLink }),
  });
};

export const sendAuthenticationLink = async (payload) => {
  const authLink = `${process.env.FRONTENDURL}/authenticate?token=${payload.authenticationToken}`;
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
  console.log({ payload, where: "sendresetpasswordlink" });
  const resetLink = `${process.env.FRONTENDURL}/reset-password?token=${payload.resetPasswordToken}`;
  return await resend.emails.send({
    from: "Support <info@developer.cribe.org>",
    to: payload.email,
    subject: "Reset Password Link",
    html: createForgotPasswordEmailHTML({ ...payload, resetLink }),
    text: createForgotPasswordEmailText({ ...payload, resetLink }),
  });
};

export const sendRefereeEmail = async (payload) => {
  let formLink = `${process.env.FRONTENDURL}/reference?token=${payload.refereeToken}`;

  return await resend.emails.send({
    from: "Support <info@developer.cribe.org>",
    to: payload.email,
    subject: "Reference Request",
    html: createReferenceEmailHTML({ ...payload, formLink }),
    text: createReferenceEmailText({ ...payload, formLink }),
  });
};
