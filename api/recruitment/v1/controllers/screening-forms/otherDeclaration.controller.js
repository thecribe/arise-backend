import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getOtherDeclaration = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.OtherDeclaration.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Error retreiving details" });
  }
};

export const uploadOtherDeclaration = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;

  const { userId } = req.params;

  try {
    const check = await db.OtherDeclaration.findOne({
      where: { userId },
    });
    const payload = {
      signature: mergeUploadFilestoJson(
        check ? check.signature : "[]",
        uploadedFiles.signature,
      ),
      date: body.date,
    };

    const percentage = getCompletionPercentage(payload);
    if (check) {
      if (!check.audit_status) {
        await db.OtherDeclaration.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating Other Declarations details" });
      }
    } else {
      await db.OtherDeclaration.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Other Declarations updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating Other Declarations details" });
  }
};

export const updateOtherDeclaration = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.OtherDeclaration.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.OtherDeclaration.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating Other Declarations details" });
    }
    return res
      .status(200)
      .json({ message: "Other Declarations Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating Other Declarations details" });
  }
};

export const updateOtherDeclarationAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.OtherDeclaration.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.OtherDeclaration.update(
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
      .json({ message: "Error updating Other Declarations details" });
  }
};
