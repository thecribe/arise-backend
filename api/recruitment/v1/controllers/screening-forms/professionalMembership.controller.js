import { Op } from "sequelize";
import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getProfessionalMembership = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.ProfessionalMembership.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(400).json({ message: "Error retreiving details" });
  }
};

export const uploadProfessionalMembership = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.ProfessionalMembership.findOne({
      where: { userId },
    });

    if (check) {
      if (!check.audit_status) {
        const payload = {
          body_type: body.body_type,
          pin: body.pin,
          renewal_date: body.renewal_date,
          membership_card_upload: mergeUploadFilestoJson(
            check.membership_card_upload,
            uploadedFiles.membership_card_upload,
          ),
          available_document: body.available_document,
          dbs_disclosure: body.dbs_disclosure,
          issue_date: body.issue_date,
          expiry_date: body.expiry_date,
          clear: body.clear,
          disclosure_number: body.disclosure_number,
          certificate_registration: body.certificate_registration,
          current_dbs_upload: mergeUploadFilestoJson(
            check.current_dbs_upload,
            uploadedFiles.current_dbs_upload,
          ),
          pbv_issue_date: body.pbv_issue_date,
          pbv_expiry_date: body.pbv_expiry_date,
          pbv_document_upload: mergeUploadFilestoJson(
            check.pbv_document_upload,
            uploadedFiles.pbv_document_upload,
          ),
          dbs_update_check: mergeUploadFilestoJson(
            check.dbs_update_check,
            uploadedFiles.dbs_update_check,
          ),
        };

        const percentage = getCompletionPercentage(payload);
        await db.ProfessionalMembership.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating  Professional Membership details" });
      }
    } else {
      const payload = {
        body_type: body.body_type,
        pin: body.pin,
        renewal_date: body.renewal_date,
        membership_card_upload: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.membership_card_upload,
        ),
        available_document: body.available_document,
        dbs_disclosure: body.dbs_disclosure,
        issue_date: body.issue_date,
        expiry_date: body.expiry_date,
        clear: body.clear,
        disclosure_number: body.disclosure_number,
        certificate_registration: body.certificate_registration,
        current_dbs_upload: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.current_dbs_upload,
        ),
        pbv_issue_date: body.pbv_issue_date,
        pbv_expiry_date: body.pbv_expiry_date,
        pbv_document_upload: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.pbv_document_upload,
        ),
        dbs_update_check: mergeUploadFilestoJson(
          "[]",
          uploadedFiles.dbs_update_check,
        ),
      };

      const percentage = getCompletionPercentage(payload);
      await db.ProfessionalMembership.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: " Professional Membership updated Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating  Professional Membership details" });
  }
};

export const updateProfessionalMembership = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.ProfessionalMembership.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.ProfessionalMembership.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating  Professional Membership details" });
    }
    return res
      .status(200)
      .json({ message: " Professional Membership Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Professional Membership details" });
  }
};

export const updateProfessionalMembershipAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.ProfessionalMembership.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.ProfessionalMembership.update(
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
      .json({ message: "Error updating  ProfessionalMembership details" });
  }
};
