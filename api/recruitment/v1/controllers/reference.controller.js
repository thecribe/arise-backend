//REFERENCE CONTROLLER

import { Op } from "sequelize";
import db from "../../../../models/index.js";
import { getCompletionPercentage } from "../utils/generalUtils.js";

export const getReference = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    const reference = await db.Reference.findAll({
      where: { userId },
    });

    return res.status(200).json({ data: reference });
  } catch (error) {
    return res.status(400).json({ message: "Unable to get Reference" });
  }
};

export const uploadReference = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    company_name: body.company_name,
    from_date: body.from_date,
    to_date: body.to_date,
    referee_name: body.referee_name,
    referee_email: body.referee_email.toLowerCase().trim(),
    referee_phone: body.referee_phone,
    referee_relationship: body.referee_relationship,
    userId,
  };
  const percentage = getCompletionPercentage(payload);
  try {
    const check = await db.Reference.findOne({
      where: { userId },
    });

    if (check?.audit_status) {
      return res
        .status(400)
        .json({ message: "Unable to add Reference. Reference audited" });
    }
    if (check) {
      //CONFIRM EMAIL
      const checkemail = await db.Reference.findOne({
        where: {
          [Op.and]: [{ referee_email: payload.referee_email }, { userId }],
        },
      });
      if (checkemail) {
        return res.status(400).json({
          message: "Unable to add Reference. Reference email already in use",
        });
      }
    }
    await db.Reference.create({ ...payload, completion_rate: percentage });
    return res.status(200).json({ message: "Reference created successfully" });
    // const reference = await Reference.findAll({
    //   where: { userId: userId },
    // });
    // return Response.json({ data: reference }, { status: 200 });
  } catch (error) {
    return res.status(400).json({ message: "Unable to add Reference" });
  }
};

export const updateReference = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    company_name: body.company_name,
    from_date: body.from_date,
    to_date: body.to_date,
    referee_name: body.referee_name,
    referee_email: body.referee_email.toLowerCase().trim(),
    referee_phone: body.referee_phone,
    referee_relationship: body.referee_relationship,
  };
  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.Reference.findOne({
      where: { userId },
    });

    if (check?.audit_status) {
      return res
        .status(400)
        .json({ message: "Unable to Update Reference. Reference audited" });
    }

    if (check?.referee_email !== payload.referee_email) {
      const checkemail = await db.Reference.findOne({
        where: {
          [Op.and]: [{ referee_email: payload.referee_email }, { userId }],
        },
      });
      if (checkemail) {
        return res.status(400).json({
          message: "Unable to update Reference. Reference email already in use",
        });
      }
    }

    await db.Reference.update(
      { ...payload, completion_rate: percentage },
      {
        where: { id: body.id },
      },
    );

    return res.status(200).json({ message: "Reference updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to update Reference" });
  }
};

export const deleteReference = async (req, res) => {
  const { referenceId } = req.params;

  try {
    const check = await db.Reference.findOne({
      where: { id: referenceId },
    });

    if (check?.audit_status) {
      return res
        .status(400)
        .json({ message: "Unable to Update Reference. Reference audited" });
    }
    await db.Reference.destroy({
      where: { id: referenceId },
    });
    return res.status(200).json({ message: "Reference deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete Reference" });
  }
};

export const setReferenceAuditStatus = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;
  try {
    const check = await db.Reference.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Reference.update(
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
      .json({ message: "Error updating Previous job details" });
  }
};
