//SINGLE USER COMPLETION RATE

import { Op } from "sequelize";
import db from "../../../../models/index.js";

const tables = [
  { model: "PersonalInfo", key: "personal_info" },
  { model: "Address", key: "address_details" },
  { model: "Passports", key: "passport_photo" },
  { model: "Resume", key: "resume" },
  { model: "ContactInfo", key: "contact" },
  { model: "EmergencyContact", key: "emergency_contact" },
  { model: "CurrentJob", key: "current_job" },
  { model: "PreviousJob", key: "previous_job" },
  { model: "EducationQualification", key: "educational_qualification" },
  { model: "RightToWork", key: "right_to_work" },
  { model: "ProfessionalMembership", key: "professional_memberships" },
  { model: "BankDetails", key: "bank_payment_details" },
  { model: "Immunisation", key: "immunisations" },
  { model: "DrivingDetails", key: "driving_details" },
  { model: "HealthDeclaration", key: "health_declarations" },
  { model: "DisabilityAct", key: "disability_discrimination_act" },
  { model: "Confidentility", key: "confidentiality" },
  { model: "Consent", key: "consent" },
  { model: "PersonalDeclaration", key: "personal_declarations" },
  { model: "WorkingTime", key: "working_time" },
  { model: "OtherDeclaration", key: "other_declarations" },
  { model: "HealthAndSafety", key: "health_and_safety" },
  { model: "Rehabilitation", key: "rehabilitation" },
];

export const getSingleUserCompletionRate = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    const results = await Promise.all(
      tables.map(async ({ model }) => {
        const records = await db[model].findAll({
          where: { userId },
          attributes: ["completion_rate"],
          raw: true,
        });

        const score =
          records.length > 0
            ? Number(
                (
                  records.reduce(
                    (sum, r) => sum + Number(r.completion_rate || 0),
                    0,
                  ) / records.length
                ).toFixed(1),
              )
            : 0;

        return score;
      }),
    );

    const screeningRate =
      results.length > 0
        ? Number(
            (results.reduce((sum, s) => sum + s, 0) / results.length).toFixed(
              1,
            ),
          )
        : 0;

    // Reference rate
    const referenceRate =
      (
        await db.Reference.findOne({
          attributes: [
            [
              db.sequelize.fn("AVG", db.sequelize.col("completion_rate")),
              "referenceRate",
            ],
          ],
          where: { userId },
          raw: true,
        })
      )?.referenceRate || 0;

    // Training rate
    const trainingRate =
      (
        await db.ApplicantsCertificates.findOne({
          attributes: [
            [
              db.sequelize.fn("AVG", db.sequelize.col("completion_rate")),
              "trainingRate",
            ],
          ],
          where: {
            userId,
            mandatory_certificateId: { [Op.ne]: null },
          },
          raw: true,
        })
      )?.trainingRate || 0;

    return res.status(200).json({
      screeningRate,
      referenceRate: Number(referenceRate).toFixed(1),
      trainingRate: Number(trainingRate).toFixed(1),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving details" });
  }
};

export const getFormCompletionRate = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    const results = await Promise.all(
      tables.map(async ({ model, key }) => {
        const records = await db[model].findAll({
          where: { userId },
          attributes: ["completion_rate"],
          raw: true,
        });

        const completionRate =
          records.length > 0
            ? Number(
                (
                  records.reduce(
                    (sum, r) => sum + Number(r.completion_rate),
                    0,
                  ) / records.length
                ).toFixed(1),
              )
            : 0;

        return { [key]: completionRate };
      }),
    );

    const completionRates = Object.assign({}, ...results);

    return res.status(200).json({ completionRates });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving details" });
  }
};
