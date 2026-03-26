import { Op } from "sequelize";
import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getPreviousJob = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.PreviousJob.findAll({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(200).json({ message: "Error retreiving details" });
  }
};

export const uploadPreviousJob = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    job_title: body.job_title,
    name_of_employer: body.name_of_employer,
    address: body.address,
    reason_for_leaving: body.reason_for_leaving,
    from_date: body.from_date,
    to_date: body.to_date,
    duties: body.duties,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    if (!body.id || body.id === "undefined") {
      await db.PreviousJob.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    } else {
      const check = await db.PreviousJob.findOne({
        where: { id: body.id },
      });

      if (!check.audit_status) {
        await db.PreviousJob.update(
          { ...payload, completion_rate: percentage },
          { where: { id: body.id } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating Previous Job details" });
      }
    }

    return res
      .status(200)
      .json({ message: "Previous Job updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating Previous Job details" });
  }
};

export const updatePreviousJob = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.PreviousJob.findOne({
      where: { [Op.and]: [{ userId }, { id: body.id }] },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.PreviousJob.update(body, {
        where: { [Op.and]: [{ userId }, { id: body.id }] },
      });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating Previous Job details" });
    }
    return res
      .status(200)
      .json({ message: "Previous job Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating Previous Job details" });
  }
};

export const updatePreviousJobAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.PreviousJob.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.PreviousJob.update(
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
      .json({ message: "Error updating Previous jb details" });
  }
};

export const deletePreviousJob = async (req, res) => {
  const { objectId } = req.params;

  try {
    const check = await db.PreviousJob.findOne({
      where: {
        id: objectId,
      },
    });

    if (!check.audit_status) {
      await db.PreviousJob.destroy({
        where: {
          id: objectId,
        },
      });
    } else {
      return res
        .status(400)
        .json({ message: "Unable to delete previous job details" });
    }
    return res
      .status(200)
      .json({ message: "Previous Job Updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating Previous job details" });
  }
};
