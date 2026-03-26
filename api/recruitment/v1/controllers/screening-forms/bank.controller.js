import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getBankDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.BankDetails.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadBankDetails = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    name_of_bank: body.name_of_bank,
    account_name: body.account_name,
    account_type: body.account_type,
    address: body.address,
    postal_code: body.postal_code,
    account_no: body.account_no,
    sort_code: body.sort_code,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.BankDetails.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        await db.BankDetails.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating Bank Details details" });
      }
    } else {
      await db.BankDetails.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: " Bank Details updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Bank Details details" });
  }
};

export const updateBankDetails = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.BankDetails.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.BankDetails.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating  Bank Details details" });
    }
    return res
      .status(200)
      .json({ message: " Bank Details Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Bank Details details" });
  }
};

export const updateBankDetailsAuditStatus = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  try {
    const check = await db.BankDetails.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.BankDetails.update(
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
    return res
      .status(400)
      .json({ message: "Please fill the form before auditing" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Bank Details details" });
  }
};
