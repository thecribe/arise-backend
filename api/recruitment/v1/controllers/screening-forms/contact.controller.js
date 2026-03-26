import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getContact = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.ContactInfo.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadContact = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  const payload = {
    mobile_no: body.mobile_no,
    landline: body.landline,
    email: body.email,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.ContactInfo.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        await db.ContactInfo.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating  Contact details" });
      }
    } else {
      await db.ContactInfo.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res.status(200).json({ message: " Contact updated Successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error updating  Contact details" });
  }
};

export const updateContact = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.ContactInfo.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.ContactInfo.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating  Contact Info details" });
    }
    return res
      .status(200)
      .json({ message: " Contact Info Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Contact Info details" });
  }
};

export const updateContactAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.ContactInfo.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.ContactInfo.update(
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
      .json({ message: "Error updating  ContactInfo details" });
  }
};
