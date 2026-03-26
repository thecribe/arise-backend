import { Op } from "sequelize";
import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getRightToWork = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.RightToWork.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadRightToWork = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.RightToWork.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        const payload = {
          entitlement: body.entitlement,
          passport_number: body.passport_number,
          expiry_date: body.expiry_date,
          share_code: body.share_code,
          passport_proof: mergeUploadFilestoJson(
            check.passport_proof,
            uploadedFiles.passport_proof,
          ),
          brp_proof: mergeUploadFilestoJson(
            check.brp_proof,
            uploadedFiles.brp_proof,
          ),
          right_to_work_update_check: mergeUploadFilestoJson(
            check.right_to_work_update_check,
            uploadedFiles.right_to_work_update_check,
          ),
        };

        const percentage = getCompletionPercentage(payload);
        await db.RightToWork.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating Emergency contact details" });
      }
    } else {
      const payload = {
        entitlement: body.entitlement,
        passport_number: body.passport_number,
        expiry_date: body.expiry_date,
        share_code: body.share_code,
        passport_proof: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.passport_proof,
        ),
        brp_proof: mergeUploadFilestoJson("[]", uploadedFiles.brp_proof),
        right_to_work_update_check: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.right_to_work_update_check,
        ),
      };

      const percentage = getCompletionPercentage(payload);
      await db.RightToWork.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Emergency contact updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating emergency contact details" });
  }
};

export const updateRightToWork = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.RightToWork.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.RightToWork.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating emergency contact details" });
    }
    return res
      .status(200)
      .json({ message: "Emergency contact Updated Successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating Emergency contact details",
    });
  }
};

export const updateRightToWorkAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.RightToWork.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.RightToWork.update(
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
      .json({ message: "Error updating emergency contact details" });
  }
};
