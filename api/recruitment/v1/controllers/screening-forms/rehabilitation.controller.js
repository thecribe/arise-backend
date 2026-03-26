import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getRehabilitation = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.Rehabilitation.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(200).json({ message: "Error retreiving details" });
  }
};

export const uploadRehabilitation = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;

  const { userId } = req.params;

  const payload = {
    conviction: body.conviction,
    disciplinary_action: body.disciplinary_action,
    criminal_charges: body.criminal_charges,
    consent: body.consent,
    police_check: body.police_check,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.Rehabilitation.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        await db.Rehabilitation.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating Emergency contact details" });
      }
    } else {
      await db.Rehabilitation.create({
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

export const updateRehabilitation = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.Rehabilitation.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.Rehabilitation.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating emergency contact details" });
    }
    return res
      .status(200)
      .json({ message: "Emergency contact Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating Emergency contact details" });
  }
};

export const updateRehabilitationAuditStatus = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;
  try {
    const check = await db.Rehabilitation.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Rehabilitation.update(
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
