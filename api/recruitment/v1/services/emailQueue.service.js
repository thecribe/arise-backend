import db from "../../../../models/index.js";
import {
  sendEmailVerification,
  sendRefereeEmail,
  sendResetPasswordLink,
} from "../email/emailHandler.js";

export const processSingleEmailJob = async (job) => {
  try {
    await job.update({
      status: "processing",
    });

    let payload = null;
    if (typeof payload === "string") {
      payload = JSON.parse(job.payload);
    }

    console.log({ payload });
    switch (job.type) {
      case "verify-email":
        await sendEmailVerification(payload ? payload : job.payload);
        break;
      case "reset-password":
        await sendResetPasswordLink(payload ? payload : job.payload);
        break;
      case "reference":
        await sendRefereeEmail(payload ? payload : job.payload);
        break;

      default:
        throw new Error(`Unknown email type: ${job.type}`);
    }

    await job.update({
      status: "sent",
      processedAt: new Date(),
      error: null,
    });

    return true;
  } catch (error) {
    await job.update({
      status: job.attempts + 1 >= 5 ? "failed" : "pending",

      attempts: job.attempts + 1,

      error: error.message,
    });

    return false;
  }
};

export const processEmailQueue = async () => {
  const jobs = await db.EmailQueue.findAll({
    where: {
      status: "pending",

      attempts: {
        [Op.lt]: 5,
      },
    },

    limit: 20,

    order: [["createdAt", "ASC"]],
  });

  for (const job of jobs) {
    await processSingleEmailJob(job);
  }
};
