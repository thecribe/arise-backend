import db from "../../../../models/index.js";
import { processSingleEmailJob } from "./emailQueue.service.js";

export const sendEmailWithFallback = async (emailJobId) => {
  try {
    const job = await db.EmailQueues.findByPk(emailJobId);

    console.log({ emailJobId, job, where: "sendEmailWIth" });
    if (!job) return;

    await processSingleEmailJob(job);
  } catch (error) {
    console.error(error);
  }
};
