import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getCurrentJob = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.CurrentJob.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadCurrentJob = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  const payload = {
    job_title: body.job_title,
    current_place_of_work: body.current_place_of_work,
    current_pay: body.current_pay,
    shift: body.shift,
    duties: body.duties,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.CurrentJob.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        await db.CurrentJob.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating current Job details" });
      }
    } else {
      await db.CurrentJob.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Current Job updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Job details" });
  }
};

export const updateCurrentJob = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.CurrentJob.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.CurrentJob.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating current Job details" });
    }
    return res
      .status(200)
      .json({ message: "Current job Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating current Job details" });
  }
};

export const updateCurrentJobAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.CurrentJob.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.CurrentJob.update(
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
      .status(500)
      .json({ message: "Error updating current jb details" });
  }
};
