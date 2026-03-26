import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.Address.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadAddress = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.Address.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        const payload = {
          house_number: body.house_number.toString(),
          address: body.address,
          city: body.city,
          state: body.state,
          postal_code: body.postal_code,
          country: body.country,
          from_date: body.from_date,
          to_date: body.to_date,
          proof_of_address: mergeUploadFilestoJson(
            check.proof_of_address,
            uploadedFiles.proof_of_address,
          ),
        };

        const percentage = getCompletionPercentage(payload);

        await db.Address.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating current address details" });
      }
    } else {
      const payload = {
        house_number: body.house_number.toString(),
        address: body.address,
        city: body.city,
        state: body.state,
        postal_code: body.postal_code,
        country: body.country,
        from_date: body.from_date,
        to_date: body.to_date,
        proof_of_address: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.proof_of_address,
        ),
      };

      const percentage = getCompletionPercentage(payload);
      await db.Address.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Current address updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current address details" });
  }
};

export const updateAddress = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.Address.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.Address.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating current address details" });
    }
    return res
      .status(200)
      .json({ message: "Current address Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current address details" });
  }
};

export const updateAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.Address.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Address.update(
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
      .json({ message: "Error updating current address details" });
  }
};
