// Your controller (e.g. userProgressController.js)

import db from "../../../../models/index.js";
import { getSectionProgress } from "../utils/analyticsHelper.js";

const personalDetailsList = [
  { model: "PersonalInfo", key: "personal_info" },
  { model: "Address", key: "address_details" },
  { model: "Passports", key: "passport_photo" },
  { model: "Resume", key: "resume" },
  { model: "ContactInfo", key: "contact" },
  { model: "EmergencyContact", key: "emergency_contact" },
];

const workHistoryList = [
  { model: "CurrentJob", key: "current_job" },
  { model: "PreviousJob", key: "previous_job" },
];

const educationAndQualificationsList = [
  { model: "EducationQualification", key: "educational_qualification" },
];

const professionalMembershipsList = [
  { model: "RightToWork", key: "right_to_work" },
  { model: "ProfessionalMembership", key: "professional_memberships" },
  { model: "BankDetails", key: "bank_payment_details" },
  { model: "Immunisation", key: "immunisations" },
  { model: "DrivingDetails", key: "driving_details" },
];

const declarationsList = [
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
export const getUserAllFormProgress = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  try {
    const [
      personalSection,
      workSection,
      educationSection,
      professionalSection,
      declarationsSection,
    ] = await Promise.all([
      getSectionProgress(userId, personalDetailsList, db),
      getSectionProgress(userId, workHistoryList, db),
      getSectionProgress(userId, educationAndQualificationsList, db),
      getSectionProgress(userId, professionalMembershipsList, db),
      getSectionProgress(userId, declarationsList, db),
    ]);

    const overallProgress =
      (personalSection.section_progress +
        workSection.section_progress +
        educationSection.section_progress +
        professionalSection.section_progress +
        declarationsSection.section_progress) /
      5;

    const response = {
      overall_completion_rate: Number(overallProgress.toFixed(1)),

      personal_details: {
        section_progress: personalSection.section_progress,
        forms: personalSection.forms,
      },

      work_history: {
        section_progress: workSection.section_progress,
        forms: workSection.forms,
      },

      education_and_qualifications: {
        section_progress: educationSection.section_progress,
        forms: educationSection.forms,
      },

      professional_details: {
        section_progress: professionalSection.section_progress,
        forms: professionalSection.forms,
      },

      declarations: {
        section_progress: declarationsSection.section_progress,
        forms: declarationsSection.forms,
      },
    };

    return res.status(200).json({ data: response });
  } catch (error) {
    console.error("Error fetching user form progress:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserComplianceStatus = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing applicant id" });
  }

  // const getFormEntry = async (userId, section, db) => {
  //   section.map(({ model, key }) => {});
  // };

  const allforms = [
    ...personalDetailsList,
    ...workHistoryList,
    ...educationAndQualificationsList,
    ...professionalMembershipsList,
    ...declarationsList,
  ];
  try {
    const formentries = await Promise.all([
      ...allforms.map(async ({ model, key }) => {
        const Model = db[model];
        if (["educational_qualification", "previous_job"].includes(key)) {
          const entry = await Model.findAll({
            where: { userId },
            include: {
              all: true,
              // nested: true,
              attributes: { exclude: ["password", "emailVerified"] },
            },
          });
          return { key, entry };
        } else {
          const entry = await Model.findOne({
            where: { userId },
            include: {
              all: true,
              // nested: true,
              attributes: { exclude: ["password", "emailVerified"] },
            },
          });
          return { key, entry };
        }
      }),
    ]);

    const objEntries = {};
    formentries.forEach(({ key, entry }) => {
      objEntries[key] = entry;
    });

    const reference = await db.Reference.findAll({
      where: { userId },
      include: [{ model: db.ReferenceMailStatus, as: "mail_status" }],
    });

    return res.status(200).json({ references: reference, ...objEntries });
  } catch (error) {
    console.error("Error fetching form entries:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
