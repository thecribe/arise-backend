import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getPassportPhoto = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.Passports.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Error retreiving details" });
  }
};

export const uploadPassportPhoto = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.Passports.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        const payload = {
          passport: mergeUploadFilestoJson(
            check.passport,
            uploadedFiles.passport,
          ),
          proof_of_insurance: mergeUploadFilestoJson(
            check.proof_of_insurance,
            uploadedFiles.proof_of_insurance,
          ),
        };

        const percentage = getCompletionPercentage(payload);
        await db.Passports.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating current Passports details" });
      }
    } else {
      const payload = {
        passport: mergeUploadFilestoJson("[]", uploadedFiles.passport),
        proof_of_insurance: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.proof_of_insurance,
        ),
      };

      const percentage = getCompletionPercentage(payload);
      await db.Passports.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Current Passports updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Passports details" });
  }
};

export const updatePassportPhoto = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.Passports.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.Passports.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating current Passports details" });
    }
    return res
      .status(200)
      .json({ message: "Current Passports Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating current Passports details" });
  }
};

export const updatePassportPhotoAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.Passports.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Passports.update(
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
      .json({ message: "Error updating current Passports details" });
  }
};
