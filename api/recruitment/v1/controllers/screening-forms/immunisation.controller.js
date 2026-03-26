import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getImmunisation = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.Immunisation.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadImmunisation = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.Immunisation.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        const payload = {
          hep_b: body.hep_b,
          hep_b_certificate: mergeUploadFilestoJson(
            check.hep_b_certificate,
            uploadedFiles.hep_b_certificate,
          ),
          tb: body.tb,
          tb_certificate: mergeUploadFilestoJson(
            check.tb_certificate,
            uploadedFiles.tb_certificate,
          ),
          varicella: body.varicella,
          varicella_certificate: mergeUploadFilestoJson(
            check.varicella_certificate,
            uploadedFiles.varicella_certificate,
          ),
          measles: body.measles,
          measles_certificate: mergeUploadFilestoJson(
            check.measles_certificate,
            uploadedFiles.measles_certificate,
          ),
          rubella: body.rubella,
          rubella_certificate: mergeUploadFilestoJson(
            check.rubella_certificate,
            uploadedFiles.rubella_certificate,
          ),
          hep_b_antigen: body.hep_b_antigen,
          hep_b_antigen_certificate: mergeUploadFilestoJson(
            check.hep_b_antigen_certificate,
            uploadedFiles.hep_b_antigen_certificate,
          ),
          hep_c: body.hep_c,
          hep_c_certificate: mergeUploadFilestoJson(
            check.hep_c_certificate,
            uploadedFiles.hep_c_certificate,
          ),
          hiv: body.hiv,
          hiv_certificate: mergeUploadFilestoJson(
            check.hiv_certificate,
            uploadedFiles.hiv_certificate,
          ),
          signature: mergeUploadFilestoJson(
            check.signature,
            uploadedFiles.signature,
          ),
          date: body.date,
        };

        const percentage = getCompletionPercentage(payload);
        await db.Immunisation.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating current Immunisation details" });
      }
    } else {
      const payload = {
        hep_b: body.hep_b,
        hep_b_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.hep_b_certificate,
        ),
        tb: body.tb,
        tb_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.tb_certificate,
        ),
        varicella: body.varicella,
        varicella_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.varicella_certificate,
        ),
        measles: body.measles,
        measles_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.measles_certificate,
        ),
        rubella: body.rubella,
        rubella_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.rubella_certificate,
        ),
        hep_b_antigen: body.hep_b_antigen,
        hep_b_antigen_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.hep_b_antigen_certificate,
        ),
        hep_c: body.hep_c,
        hep_c_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.hep_c_certificate,
        ),
        hiv: body.hiv,
        hiv_certificate: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.hiv_certificate,
        ),
        signature: mergeUploadFilestoJson("[]", uploadedFiles.signature),
        date: body.date,
      };

      const percentage = getCompletionPercentage(payload);
      await db.Immunisation.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Current Immunisation updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Immunisation details" });
  }
};

export const updateImmunisation = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.Immunisation.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.Immunisation.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating current Immunisation details" });
    }
    return res
      .status(200)
      .json({ message: "Current Immunisation Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating current Immunisation details" });
  }
};

export const updateImmunisationAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.Immunisation.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Immunisation.update(
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
      .json({ message: "Error updating current Immunisation details" });
  }
};
