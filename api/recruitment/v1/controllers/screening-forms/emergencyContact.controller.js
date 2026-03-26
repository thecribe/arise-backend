import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getEmergencyContact = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.EmergencyContact.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retreiving details" }, { status: 500 });
  }
};

export const uploadEmergencyContact = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  const payload = {
    next_of_kin: body.next_of_kin,
    relationship: body.relationship,
    address: body.address,
    city: body.city,
    state: body.state,
    postal_code: body.postal_code,
    country: body.country,
    mobile_no: body.mobile_no,
    email: body.email,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.EmergencyContact.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        await db.EmergencyContact.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating Emergency contact details" });
      }
    } else {
      await db.EmergencyContact.create({
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
      .status(500)
      .json({ message: "Error updating emergency contact details" });
  }
};

export const updateEmergencyContact = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.EmergencyContact.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.EmergencyContact.update(body, { where: { userId } });
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

export const updateEmergencyContactAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.EmergencyContact.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.EmergencyContact.update(
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
      .json({ message: "Error updating emergency contact details" });
  }
};
