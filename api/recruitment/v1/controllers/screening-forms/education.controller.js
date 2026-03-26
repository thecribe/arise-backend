import { Op } from "sequelize";
import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getEducationalQualification = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.EducationQualification.findAll({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadEducationalQualification = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    if (!body.id || body.id === "undefined") {
      const payload = {
        establishment: body.establishment,
        from_date: body.from_date,
        to_date: body.to_date,
        qualification: body.qualification,
        grade: body.grade,
        photo_cert: mergeUploadFilestoJson("[]", uploadedFiles.photo_cert),
      };
      const percentage = getCompletionPercentage(payload);
      await db.EducationQualification.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    } else {
      const check = await db.EducationQualification.findOne({
        where: { id: body.id },
      });

      if (!check.audit_status) {
        const payload = {
          establishment: body.establishment,
          from_date: body.from_date,
          to_date: body.to_date,
          qualification: body.qualification,
          grade: body.grade,
          photo_cert: mergeUploadFilestoJson(
            check.photo_cert,
            uploadedFiles.photo_cert,
          ),
        };
        const percentage = getCompletionPercentage(payload);
        await db.EducationQualification.update(
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
    return res
      .status(400)
      .json({ message: "Error updating Previous Job details" });
  }
};

export const updateEducationalQualification = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.EducationQualification.findOne({
      where: { [Op.and]: [{ userId }, { id: body.id }] },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.EducationQualification.update(body, {
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
      .status(400)
      .json({ message: "Error updating Previous Job details" });
  }
};

export const updateEducationalQualificationAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.EducationQualification.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.EducationQualification.update(
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

export const deleteEducationalQualification = async (req, res) => {
  const { objectId } = req.params;

  try {
    const check = await db.EducationQualification.findOne({
      where: {
        id: objectId,
      },
    });

    if (!check.audit_status) {
      await db.EducationQualification.destroy({
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
