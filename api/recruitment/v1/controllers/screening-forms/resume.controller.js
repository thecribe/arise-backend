import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getResume = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.Resume.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data }, { status: 200 });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadResume = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.Resume.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        const payload = {
          resume: mergeUploadFilestoJson(check.resume, uploadedFiles.resume),
          date_of_birth_certificate: mergeUploadFilestoJson(
            check.date_of_birth_certificate,
            uploadedFiles.date_of_birth_certificate,
          ),
        };
        const percentage = getCompletionPercentage(payload);
        await db.Resume.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating current Resume details" });
      }
    } else {
      const payload = {
        resume: mergeUploadFilestoJson("[]", uploadedFiles.resume),
        date_of_birth_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.date_of_birth_certificate,
        ),
      };
      const percentage = getCompletionPercentage(payload);
      await db.Resume.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Current Resume updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Resume details" });
  }
};

export const updateResume = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.Resume.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.Resume.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating current Resume details" });
    }
    return res
      .status(200)
      .json({ message: "Current Resume Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Resume details" });
  }
};

export const updateResumeAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.Resume.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Resume.update(
          { audit_status: !check.audit_status },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating audit status details" });
      }
      return res
        .status(200)
        .json({ message: "Audit Status Updated Successfully" });
    }
    return res.status(400).json({ message: "Error updating audit status " });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Resume details" });
  }
};
