// SINGLE USER COMPLETION RATE - FIXED & OPTIMIZED

import { Op } from "sequelize";
import db from "../../../../models/index.js";
import { getSectionProgress } from "../utils/analyticsHelper.js";

// All tables with their model and key
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

export const getSingleUserScreeningCompletionRate = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    const completionRateObject = Object.fromEntries(
      await Promise.all(
        tables.map(async ({ model, key }) => {
          const Model = db[model];

          if (!Model) return [key, 0];

          const result = await Model.findOne({
            where: { userId },
            order: [["createdAt", "ASC"]],
            attributes: ["completion_rate"],
            raw: true,
          });

          return [key, result?.completion_rate ?? 0];
        }),
      ),
    );

    return res.status(200).json(completionRateObject);
  } catch (error) {
    console.error("Error in getSingleUserScreeningCompletionRate:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving screening completion rate" });
  }
};

// Reusable helper function
const getFormData = async (userId, model) => {
  const records = await db[model].findAll({
    where: { userId },
    attributes: ["completion_rate"],
    raw: true,
  });

  if (records.length === 0) {
    return { average: 0, sum: 0, count: 0 };
  }

  const sum = records.reduce(
    (acc, r) => acc + Number(r.completion_rate || 0),
    0,
  );
  const average = Number((sum / records.length).toFixed(1));

  return { average, sum, count: records.length };
};

export const getSingleUserCompletionRate = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    // Get completion rate for all main forms
    const formData = await Promise.all(
      tables.map(({ model }) => getFormData(userId, model)),
    );

    const totalSum = formData.reduce((acc, f) => acc + f.sum, 0);
    const totalRecords = formData.reduce((acc, f) => acc + f.count, 0);

    const trueOverallRate =
      totalRecords > 0 ? Number((totalSum / totalRecords).toFixed(1)) : 0;

    const screeningRate = trueOverallRate;

    // Reference Rate
    const referenceData = await db.Reference.findOne({
      attributes: [
        [
          db.sequelize.fn("AVG", db.sequelize.col("completion_rate")),
          "referenceRate",
        ],
      ],
      where: { userId },
      raw: true,
    });

    const referenceRate = referenceData?.referenceRate
      ? Number(Number(referenceData.referenceRate).toFixed(1))
      : 0;

    // Training Rate (Mandatory Certificates)
    const trainingData = await db.ApplicantsCertificates.findOne({
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
    });

    const trainingRate = trainingData?.trainingRate
      ? Number(Number(trainingData.trainingRate).toFixed(1))
      : 0;

    return res.status(200).json({
      screeningRate,
      referenceRate,
      trainingRate,
      totalForms: tables.length,
    });
  } catch (error) {
    console.error("Error in getSingleUserCompletionRate:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving completion rate" });
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
        const progress = await getFormCompletion(userId, model);
        return { [key]: progress };
      }),
    );

    const completionRates = Object.assign({}, ...results);

    // Also return section-wise summary (optional but very useful)
    const personalDetails = [
      "personal_info",
      "address_details",
      "passport_photo",
      "resume",
      "contact",
      "emergency_contact",
    ];
    const workHistory = ["current_job", "previous_job"];
    const education = ["educational_qualification"];
    const professional = [
      "right_to_work",
      "professional_memberships",
      "bank_payment_details",
      "immunisations",
      "driving_details",
    ];
    const declarations = [
      "health_declarations",
      "disability_discrimination_act",
      "confidentiality",
      "consent",
      "personal_declarations",
      "working_time",
      "other_declarations",
      "health_and_safety",
      "rehabilitation",
    ];

    const calculateSectionAverage = (keys) => {
      const values = keys.map((key) => completionRates[key] || 0);
      return values.length > 0
        ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(1))
        : 0;
    };

    return res.status(200).json({
      completionRates,
      sections: {
        personal_details: calculateSectionAverage(personalDetails),
        work_history: calculateSectionAverage(workHistory),
        education_and_qualifications: calculateSectionAverage(education),
        professional_details: calculateSectionAverage(professional),
        declarations: calculateSectionAverage(declarations),
      },
      overall: Number(
        (
          Object.values(completionRates).reduce((a, b) => a + b, 0) /
          tables.length
        ).toFixed(1),
      ),
    });
  } catch (error) {
    console.error("Error in getFormCompletionRate:", error);
    return res
      .status(500)
      .json({ message: "Error retrieving form completion rates" });
  }
};
