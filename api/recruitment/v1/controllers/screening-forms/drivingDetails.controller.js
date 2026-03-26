import db from "../../../../../models/index.js";
import {
  getCompletionPercentage,
  mergeUploadFilestoJson,
} from "../../utils/generalUtils.js";

export const getDrivingDetails = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.DrivingDetails.findOne({
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Error retreiving details" });
  }
};

export const uploadDrivingDetails = async (req, res) => {
  const body = req.body;
  const uploadedFiles = req.uploadedFiles;
  const { userId } = req.params;

  try {
    const check = await db.DrivingDetails.findOne({
      where: { userId },
    });
    const payload = {
      driver_license: body.driver_license,
      posess_car: body.posess_car,
      front_side_license: mergeUploadFilestoJson(
        check ? check.front_side_license : "[]",
        uploadedFiles.front_side_license,
      ),
      back_side_license: mergeUploadFilestoJson(
        check ? check.back_side_license : "[]",
        uploadedFiles.back_side_license,
      ),
    };

    const percentage = getCompletionPercentage(payload);
    if (check) {
      if (!check.audit_status) {
        await db.DrivingDetails.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating  Driving Details details" });
      }
    } else {
      await db.DrivingDetails.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: " Driving Details updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Driving Details details" });
  }
};

export const updateDrivingDetails = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const check = await db.DrivingDetails.findOne({
      where: { userId },
    });
    if (!check) {
      return res
        .status(400)
        .json({ message: "Unable to access user details " });
    }

    if (!check.audit_status) {
      await db.DrivingDetails.update(body, { where: { userId } });
    } else {
      return res
        .status(400)
        .json({ message: "Error updating  Driving Details details" });
    }
    return res
      .status(200)
      .json({ message: " Driving Details Updated Successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating  Driving Details details" });
  }
};

export const updateDrivingDetailsAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;
  try {
    const check = await db.DrivingDetails.findOne({
      where: { userId },
    });

    if (check) {
      if (check.audit_status === body.audit_status) {
        await db.DrivingDetails.update(
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
      .json({ message: "Error updating  Driving Details details" });
  }
};
