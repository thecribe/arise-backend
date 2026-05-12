//REFERENCE CONTROLLER

import { Op, where } from "sequelize";
import db from "../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../utils/generalUtils.js";
import { createToken, verifyToken } from "../utils/tokens.js";

export const getReference = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    const reference = await db.Reference.findAll({
      where: { userId },
      include: [{ model: db.ReferenceMailStatus, as: "mail_status" }],
    });

    return res.status(200).json({ data: reference });
  } catch (error) {
    return res.status(400).json({ message: "Unable to get Reference" });
  }
};

export const uploadReference = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    company_name: body.company_name,
    from_date: body.from_date,
    to_date: body.to_date,
    referee_name: body.referee_name,
    referee_email: body.referee_email.toLowerCase().trim(),
    referee_phone: body.referee_phone,
    referee_relationship: body.referee_relationship,
    userId,
  };
  const percentage = getCompletionPercentage(payload);
  try {
    const check = await db.Reference.findOne({
      where: { userId },
    });
    const t = await db.sequelize.transaction();
    if (check?.audit_status) {
      return res
        .status(400)
        .json({ message: "Unable to add Reference. Reference audited" });
    }
    if (check) {
      //CONFIRM EMAIL
      const checkemail = await db.Reference.findOne({
        where: {
          [Op.and]: [{ referee_email: payload.referee_email }, { userId }],
        },
      });
      if (checkemail) {
        return res.status(400).json({
          message: "Unable to add Reference. Reference email already in use",
        });
      }
    }
    const reference = await db.Reference.create(
      { ...payload, completion_rate: percentage },
      { transaction: t },
    );

    await db.ReferenceMailStatus.create(
      { referenceId: reference.id, status: "Not sent" },
      { transaction: t },
    );

    await t.commit();
    return res.status(200).json({ message: "Reference created successfully" });
    // const reference = await Reference.findAll({
    //   where: { userId: userId },
    // });
    // return Response.json({ data: reference }, { status: 200 });
  } catch (error) {
    await t.rollback();

    return res.status(400).json({ message: "Unable to add Reference" });
  }
};

export const updateReference = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    company_name: body.company_name,
    from_date: body.from_date,
    to_date: body.to_date,
    referee_name: body.referee_name,
    referee_email: body.referee_email.toLowerCase().trim(),
    referee_phone: body.referee_phone,
    referee_relationship: body.referee_relationship,
  };
  const percentage = getCompletionPercentage(payload);

  try {
    const check = await db.Reference.findOne({
      where: { userId },
    });

    if (check?.audit_status) {
      return res
        .status(400)
        .json({ message: "Unable to Update Reference. Reference audited" });
    }

    if (check?.referee_email !== payload.referee_email) {
      const checkemail = await db.Reference.findOne({
        where: {
          [Op.and]: [{ referee_email: payload.referee_email }, { userId }],
        },
      });
      if (checkemail) {
        return res.status(400).json({
          message: "Unable to update Reference. Reference email already in use",
        });
      }
    }

    await db.Reference.update(
      { ...payload, completion_rate: percentage },
      {
        where: { id: body.id },
      },
    );

    return res.status(200).json({ message: "Reference updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Unable to update Reference" });
  }
};

export const deleteReference = async (req, res) => {
  const { referenceId } = req.params;

  try {
    const check = await db.Reference.findOne({
      where: { id: referenceId },
    });

    if (check?.audit_status) {
      return res
        .status(400)
        .json({ message: "Unable to Update Reference. Reference audited" });
    }
    await db.Reference.destroy({
      where: { id: referenceId },
    });
    return res.status(200).json({ message: "Reference deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete Reference" });
  }
};

export const setReferenceAuditStatus = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;
  try {
    const check = await db.Reference.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.Reference.update(
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
      .json({ message: "Error updating Previous job details" });
  }
};

export const veriftyRefereeToken = async (req, res) => {
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  //VErify token

  const confirmToken = verifyToken(token);
  if (!confirmToken.valid) {
    return res.status(400).json({
      status: false,
      emailVerified: false,
      message: confirmToken.expired
        ? "Verification link has expired."
        : "Verification link is invalid.",
    });
  }
  const { referenceId, userId } = confirmToken.payload;

  try {
    const [reference, user, tokenCheck] = await Promise.all([
      db.Reference.findOne({ where: { id: referenceId } }),
      db.User.findOne({
        where: { id: userId },
        include: [{ model: db.Job_Type, as: "jobType" }],
        attributes: ["firstName", "lastName", "jobTypeSlug"],
      }),
      db.Token.findOne({ where: { token } }),
    ]);

    if (!reference || !user || !tokenCheck) {
      return res.status(400).json({ message: "Invalid token" });
    }

    if (tokenCheck.revokedAt) {
      return res.status(400).json({ message: "Token has been revoked" });
    }

    return res.status(200).json({ reference, user });
  } catch (error) {
    console.error("Error occurred while fetching reference or user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const uploadApplicantReference = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { referenceId } = req.params;
  const { token } = req.query;

  let payload = Object.fromEntries(
    Object.entries(body).map(([key, value]) => {
      if (typeof value === "string") {
        value = value.trim();
      }

      if (key === "email" && typeof value === "string") {
        value = value.toLowerCase();
      }

      return [key, value];
    }),
  );

  if (uploadedFiles?.refererSignature) {
    payload.refererSignature = mergeUploadFilestoJson(
      "[]",
      uploadedFiles.refererSignature,
    );
  }

  const findResponse = await db.ReferenceMailResponse.findOne({
    where: { referenceId },
  });
  if (findResponse) {
    return res.status(400).json({
      message: "Reference response already submitted for this reference",
    });
  }

  const t = await db.sequelize.transaction();
  try {
    await db.ReferenceMailResponse.create(
      {
        ...payload,
        referenceId,
      },
      { transaction: t },
    );

    await db.ReferenceMailStatus.update(
      { status: "Received" },
      {
        where: { referenceId },
        transaction: t,
      },
    );

    await db.Token.update(
      { revokedAt: new Date() },
      { where: { token }, transaction: t },
    );

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error("Error occurred while uploading reference file:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
  return res
    .status(200)
    .json({ message: `${referenceId} File uploaded successfully` });
};

export const getReferenceResponse = async (req, res) => {
  const { referenceId } = req.params;

  if (!referenceId) {
    return res.status(400).json({ message: "Reference ID is required" });
  }
  try {
    const response = await db.ReferenceMailResponse.findOne({
      where: { referenceId },
      include: [
        {
          model: db.Reference,
          as: "reference_details",
          include: [
            {
              model: db.User,
              as: "user",
              attributes: ["firstName", "lastName", "jobTypeSlug"],
              include: [
                {
                  model: db.Job_Type,
                  as: "jobType",
                },
              ],
            },
            { model: db.ReferenceMailStatus, as: "mail_status" },
          ],
        },
      ],
    });

    if (!response) {
      return res.status(404).json({ message: "Reference response not found" });
    }

    return res.status(200).json({ data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retreiving details" });
  }
};

export const approveReferenceResponse = async (req, res) => {
  const { referenceId } = req.params;

  if (!referenceId) {
    return res.status(400).json({ message: "Reference ID is required" });
  }

  try {
    const findStatusResponse = await db.ReferenceMailStatus.findOne({
      where: { referenceId },
    });

    if (!findStatusResponse) {
      return res.status(404).json({ message: "Reference status not found" });
    }

    if (findStatusResponse.status === "Approved") {
      const updatedStatus = await db.ReferenceMailStatus.update(
        { status: "Rejected" },
        { where: { referenceId } },
      );
    } else {
      const updatedStatus = await db.ReferenceMailStatus.update(
        { status: "Approved" },
        { where: { referenceId } },
      );
    }

    return res
      .status(200)
      .json({ message: "Reference response status updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error Updating status" });
  }
};

export const adminRefererenceUpload = async (req, res) => {
  const { referenceId } = req.params;

  if (!referenceId) {
    return res.status(400).json({ message: "Reference ID is required" });
  }

  try {
    const reference = await db.Reference.findOne({
      where: { id: referenceId },
    });

    if (!reference) {
      return res.status(400).json({ message: "Invalid reference ID" });
    }

    const getUser = await db.User.findOne({
      where: { id: reference.userId },
      attributes: ["firstName", "lastName"],
    });

    if (!getUser) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const updateReferencetoken = await db.Token.update(
      { revokedAt: new Date() },
      {
        where: {
          userId: reference.userId,
          type: "reference",
          revokedAt: null,
        },
      },
    );

    //CREATE TOKEN FOR REFERENCE
    const refereeToken = createToken(
      { referenceId, userId: reference.userId },
      "30d",
    );

    await db.Token.create({
      token: refereeToken,
      userId: reference.userId,
      type: "reference",
    });

    const mailStatus = await db.ReferenceMailStatus.findOne({
      where: { referenceId },
    });

    if (mailStatus) {
      await db.ReferenceMailStatus.update(
        { status: "pending" },
        { where: { referenceId } },
      );
    } else {
      await db.ReferenceMailStatus.create({ status: "pending", referenceId });
    }

    res.status(200).json({
      token: refereeToken,
      message: "Reference email sent successfully",
    });
  } catch (error) {
    console.error("Error in sendReferenceEmail:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
