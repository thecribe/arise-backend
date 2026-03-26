import { Op, where } from "sequelize";
import db from "../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../utils/generalUtils.js";

export const setAuditStatus = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User Id is missing!" });
  }
  try {
    const check = await db.ApplicantsCertificates.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.ApplicantsCertificates.update(
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
      .json({ message: "Error updating Working tine details" });
  }
};

//CERTIFICATE CONTROLLER

export const getUserCertificate = async (req, res) => {
  const { userId } = req.params;
  try {
    const response = await db.ApplicantsCertificates.findAll({
      where: { userId },
    });

    return res.status(200).json({ data: response });
  } catch (error) {
    return res.status(500).json({ message: `Unable to get certificates` });
  }
};

export const uploadUserCertificate = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  const payload = {
    name: body.name.trim(),
    lifetime: body.lifetime,
    issue_date: body.issue_date,
    expiry_date: body.expiry_date,
    file: mergeUploadFilestoJson("[]", uploadedFiles.file),
  };

  try {
    const findOneCert = await db.ApplicantsCertificates.findOne({
      where: {
        userId,
      },
    });
    if (findOneCert.audit_status) {
      return res.status(400).json({
        message: `Error uploading ${payload.name}. Training already audited`,
      });
    }

    const percentage = getCompletionPercentage(payload);

    if (body.mandatory_certificateId) {
      const findCert = await db.ApplicantsCertificates.findOne({
        where: {
          [Op.and]: [
            { userId },
            { mandatory_certificateId: body.mandatory_certificateId },
          ],
        },
      });

      if (findCert) {
        return res.status(400).json({ message: `Certificate already exist` });
      }
    }

    const response = await db.ApplicantsCertificates.create({
      ...payload,
      userId,
      mandatory_certificateId: body.mandatory_certificateId || null,
      completion_rate: percentage,
    });

    return res
      .status(200)
      .json({ message: `${payload.name} uploaded successfully` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: `Unable to upload ${payload.name}` });
  }
};

export const updateUserCertificate = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;

  try {
    const findCertProfile = await db.ApplicantsCertificates.findOne({
      where: { id: body.certificate_id },
    });

    const payload = {
      name: body.name.trim(),
      lifetime: body.lifetime,
      issue_date: body.issue_date,
      expiry_date: body.lifetime === "Yes" ? "" : body.expiry_date,
      file: mergeUploadFilestoJson(
        findCertProfile ? findCertProfile.file : "[]",
        uploadedFiles.file,
      ),
    };
    const percentage = getCompletionPercentage(payload);
    if (findCertProfile) {
      if (body.name.trim() === "" || !body.name) {
        return res.status(400).json({
          message: `Certificate name cannot be empty`,
        });
      }
      if (!findCertProfile.audit_status) {
        await db.ApplicantsCertificates.update(
          {
            ...payload,
            completion_rate: percentage,
          },
          {
            where: {
              id: body.certificate_id,
            },
          },
        );
      } else {
        return res.status(400).json({
          message: `Error updating ${payload.name}. Training already audited`,
        });
      }
    }

    return res
      .status(200)
      .json({ message: `${payload.name} updated successfully` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `Unable to update ${payload.name}` });
  }
};

//This controller delete selected file  upload
export const updateSingleCertificate = async (req, res) => {
  const { certificateId } = req.params;
  const body = req.body;

  const payload = {
    file: body.file,
  };

  try {
    const findCert = await db.ApplicantsCertificates.findOne({
      where: { id: certificateId },
    });

    if (findCert.audit_status) {
      return res.status(400).json({
        message: `Error uploading ${payload.name}. Training already audited`,
      });
    }
    const response = await db.ApplicantsCertificates.update(payload, {
      where: {
        id: certificateId,
      },
    });

    return res.status(200).json({ message: `File deleted successfully` });
  } catch (error) {
    return res.status(400).json({ message: `Unable to delete file` });
  }
};

export const deleteUserCertificate = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const findCert = await db.ApplicantsCertificates.findOne({
      where: { id: certificateId },
    });

    if (findCert.audit_status) {
      return res.status(400).json({
        message: `Error uploading ${payload.name}. Training already audited`,
      });
    }
    const response = await db.ApplicantsCertificates.destroy({
      where: {
        id: certificateId,
      },
    });

    return res
      .status(200)
      .json({ message: `Certificate deleted successfully` });
  } catch (error) {
    return res.status(400).json({ message: `Unable to delete certificate` });
  }
};

//COTROLLER FOR MANDATORY CERTIFICATE

export const getMandatoryCertificate = async (req, res) => {
  try {
    const certificate = await db.MandatoryCertificate.findAll();

    return res.status(200).json({ data: certificate });
  } catch (error) {
    return res.status(500).json({ message: "Unable to get certificates" });
  }
};
export const uploadMandatoryCertificate = async (req, res) => {
  const body = req.body;

  const payload = {
    name: body.name.trim(),
  };

  if (payload.name === "") {
    return res
      .status(400)
      .json({ message: "Certificate name cannot be empty" });
  }
  try {
    await db.MandatoryCertificate.create(payload);
    return res
      .status(200)
      .json({ message: `${payload.name} created successfully` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unable to create mandatory certificate" });
  }
};
export const updateMandatoryCertificate = async (req, res) => {
  const body = req.body;
  const { certificateId } = req.params;

  const payload = {
    name: body.name.trim(),
  };
  if (!certificateId) {
    return res.status(400).json({ message: "Missing certificate Id" });
  }
  if (payload.name === "") {
    return res
      .status(400)
      .json({ message: "Certificate name cannot be empty" });
  }
  try {
    await db.MandatoryCertificate.update(payload, {
      where: {
        id: certificateId,
      },
    });
    return res
      .status(200)
      .json({ message: `${payload.name} updated successfully` });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unable to update mandatory certificate" });
  }
};
export const deleteMandatoryCertificate = async (req, res) => {
  const { certificateId } = req.params;

  try {
    const response = await db.MandatoryCertificate.destroy({
      where: { id: certificateId },
    });

    return res.status(200).json({
      message: `Certificate with id ${certificateId} deleted successfully`,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Unable to delete mandatory certificate" });
  }
};
