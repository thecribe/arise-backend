import db from "../../../../../models/index.js";
import { getCompletionPercentage } from "../../utils/generalUtils.js";

export const getPersonalInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    const data = await db.PersonalInfo.findOne({
      include: [
        { model: db.Visa_Type, as: "visaType" },
        { model: db.Job_Type, as: "jobType" },
      ],
      where: { userId },
      attributes: { exclude: ["completion_rate"] },
    });

    return res.status(200).json({ data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error retreiving data" });
  }
};

export const uploadPersonalInfo = async (req, res) => {
  const body = req.body;
  const { userId } = req.params;

  const payload = {
    title: body.title,
    firstName: body.firstName,
    lastName: body.lastName,
    gender: body.gender,
    employee_id: body.employee_id,
    country: body.country,
    birthday: body.birthday,
    visa_type: body.visa_type,
    job_type: body.job_type,
  };

  const percentage = getCompletionPercentage(payload);

  try {
    const checkUser = await db.PersonalInfo.findOne({
      where: { userId },
    });

    if (checkUser) {
      if (!checkUser.audit_status) {
        await db.PersonalInfo.update(
          { ...payload, completion_rate: percentage },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating personal details data" });
      }
    } else {
      await db.PersonalInfo.create({
        ...payload,
        completion_rate: percentage,
        userId,
      });
    }
    return res
      .status(200)
      .json({ message: "Personal Details Updated Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ message: "Error updating personal details data" });
  }
};

// export const updatePersonalInfo = async (req, res) => {
//   const body = req.body;

//   const { userId } = req.params;
// };

export const updatePersonalInfoAuditStatus = async (req, res) => {
  const body = req.body;

  const { userId } = req.params;

  try {
    const checkUser = await db.PersonalInfo.findOne({
      where: { userId },
    });

    if (checkUser) {
      if (checkUser.audit_status === body.audit_status) {
        await db.PersonalInfo.update(
          { audit_status: !checkUser.audit_status },
          { where: { userId } },
        );
      } else {
        return res
          .status(400)
          .json({ message: "Error updating audit status data" });
      }
      return res
        .status(200)
        .json({ message: "Audit Status Updated Successfully" });
    }
    return res
      .status(400)
      .json({ message: "Please fill the form before Auditing " });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error updating personal details data" });
  }
};
