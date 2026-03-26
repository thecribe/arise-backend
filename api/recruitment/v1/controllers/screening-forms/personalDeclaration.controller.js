import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getPersonalDeclaration = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.PersonalDeclaration.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadPersonalDeclaration = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.PersonalDeclaration.findOne({
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
        await db.PersonalDeclaration.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating personal declarations details" });
      }
    } else {
      await db.PersonalDeclaration.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "personal declarations updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating personal declarations details" });
  }
};

export const updatePersonalDeclaration = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.PersonalDeclaration.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.PersonalDeclaration.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating personal declarations details" });
    }
    return res
      .status(200)
      .json({ message: "personal declarations Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating personal declarations details" });
  }
};

export const updatePersonalDeclarationAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.PersonalDeclaration.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.PersonalDeclaration.update(
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
      .json({ message: "Error updating personal declarations details" });
  }
};
