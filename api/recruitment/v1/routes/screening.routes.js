import express from "express";
import multer from "multer";
import {
  getAddress,
  updateAddress,
  updateAuditStatus,
  uploadAddress,
} from "../controllers/screening-forms/address.controller.js";
import {
  getBankDetails,
  updateBankDetails,
  updateBankDetailsAuditStatus,
  uploadBankDetails,
} from "../controllers/screening-forms/bank.controller.js";
import {
  getConfidentiality,
  updateConfidentiality,
  updateConfidentilityAuditStatus,
  uploadConfidentiality,
} from "../controllers/screening-forms/confidentiality.controller.js";
import {
  getConsent,
  updateConsent,
  updateConsentAuditStatus,
  uploadConsent,
} from "../controllers/screening-forms/consent.controller.js";
import {
  getContact,
  updateContact,
  updateContactAuditStatus,
  uploadContact,
} from "../controllers/screening-forms/contact.controller.js";
import {
  getCurrentJob,
  updateCurrentJob,
  updateCurrentJobAuditStatus,
  uploadCurrentJob,
} from "../controllers/screening-forms/currentJob.controller.js";
import {
  getDisability,
  updateDisability,
  updateDisabilityAuditStatus,
  uploadDisability,
} from "../controllers/screening-forms/disability.controller.js";
import {
  getDrivingDetails,
  updateDrivingDetails,
  updateDrivingDetailsAuditStatus,
  uploadDrivingDetails,
} from "../controllers/screening-forms/drivingDetails.controller.js";
import {
  deleteEducationalQualification,
  getEducationalQualification,
  updateEducationalQualification,
  updateEducationalQualificationAuditStatus,
  uploadEducationalQualification,
} from "../controllers/screening-forms/education.controller.js";
import {
  getEmergencyContact,
  updateEmergencyContact,
  updateEmergencyContactAuditStatus,
  uploadEmergencyContact,
} from "../controllers/screening-forms/emergencyContact.controller.js";
import {
  getHealthAndSafety,
  updateHealthAndSafety,
  updateHealthAndSafetyAuditStatus,
  uploadHealthAndSafety,
} from "../controllers/screening-forms/healthSafety.controller.js";
import {
  getHealthDeclaration,
  updateHealthDeclaration,
  updateHealthDeclarationAuditStatus,
  uploadHealthDeclaration,
} from "../controllers/screening-forms/healthDeclaration.controller.js";
import {
  getImmunisation,
  updateImmunisation,
  updateImmunisationAuditStatus,
  uploadImmunisation,
} from "../controllers/screening-forms/immunisation.controller.js";
import {
  getOtherDeclaration,
  updateOtherDeclaration,
  updateOtherDeclarationAuditStatus,
  uploadOtherDeclaration,
} from "../controllers/screening-forms/otherDeclaration.controller.js";
import {
  getPassportPhoto,
  updatePassportPhoto,
  updatePassportPhotoAuditStatus,
  uploadPassportPhoto,
} from "../controllers/screening-forms/passportPhoto.controller.js";
import {
  getPersonalDeclaration,
  updatePersonalDeclaration,
  updatePersonalDeclarationAuditStatus,
  uploadPersonalDeclaration,
} from "../controllers/screening-forms/personalDeclaration.controller.js";
import {
  getPersonalInfo,
  updatePersonalInfoAuditStatus,
  uploadPersonalInfo,
} from "../controllers/screening-forms/personalInfo.controller.js";
import {
  deletePreviousJob,
  getPreviousJob,
  updatePreviousJob,
  updatePreviousJobAuditStatus,
  uploadPreviousJob,
} from "../controllers/screening-forms/previousJob.controller.js";
import {
  getProfessionalMembership,
  updateProfessionalMembership,
  updateProfessionalMembershipAuditStatus,
  uploadProfessionalMembership,
} from "../controllers/screening-forms/professionalMembership.controller.js";
import {
  getRehabilitation,
  updateRehabilitation,
  updateRehabilitationAuditStatus,
  uploadRehabilitation,
} from "../controllers/screening-forms/rehabilitation.controller.js";
import {
  getResume,
  updateResume,
  updateResumeAuditStatus,
  uploadResume,
} from "../controllers/screening-forms/resume.controller.js";
import {
  getRightToWork,
  updateRightToWork,
  updateRightToWorkAuditStatus,
  uploadRightToWork,
} from "../controllers/screening-forms/rightToWork.controller.js";
import {
  getWorkingTime,
  updateWorkingTime,
  updateWorkingTimeAuditStatus,
  uploadWorkingTime,
} from "../controllers/screening-forms/workingTime.controller.js";
import { upload } from "../utils/multerHandler.js";
import { screeningUploadHandler } from "../controllers/fileUpload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

//ADDRESS DETAILS
router.get("/screening/:userId/address_details", authMiddleware, getAddress);
router.post(
  "/screening/:userId/address_details",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadAddress,
);
router.put("/screening/:userId/address_details", authMiddleware, updateAddress);
router.patch(
  "/screening/:userId/address_details",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateAuditStatus,
);

//BANK DETAILS
router.get(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  getBankDetails,
);
router.post(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadBankDetails,
);
router.put(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  updateBankDetails,
);
router.patch(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateBankDetailsAuditStatus,
);

//CONFIDENTIALITY DETAILS
router.get(
  "/screening/:userId/confidentiality",
  authMiddleware,
  getConfidentiality,
);
router.post(
  "/screening/:userId/confidentiality",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadConfidentiality,
);
router.put(
  "/screening/:userId/confidentiality",
  authMiddleware,
  updateConfidentiality,
);
router.patch(
  "/screening/:userId/confidentiality",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateConfidentilityAuditStatus,
);
//CONSENT DETAILS
router.get("/screening/:userId/consent", authMiddleware, getConsent);
router.post(
  "/screening/:userId/consent",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadConsent,
);
router.put("/screening/:userId/consent", authMiddleware, updateConsent);
router.patch(
  "/screening/:userId/consent",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateConsentAuditStatus,
);

//CONTACT INFO DETAILS
router.get("/screening/:userId/contact", authMiddleware, getContact);
router.post(
  "/screening/:userId/contact",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadContact,
);
router.put("/screening/:userId/contact", authMiddleware, updateContact);
router.patch(
  "/screening/:userId/contact",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateContactAuditStatus,
);

//Current Job DETAILS
router.get("/screening/:userId/current_job", authMiddleware, getCurrentJob);
router.post(
  "/screening/:userId/current_job",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadCurrentJob,
);
router.put("/screening/:userId/current_job", authMiddleware, updateCurrentJob);
router.patch(
  "/screening/:userId/current_job",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateCurrentJobAuditStatus,
);

//Disability  DETAILS
router.get(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  getDisability,
);
router.post(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadDisability,
);
router.put(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  updateDisability,
);
router.patch(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateDisabilityAuditStatus,
);

//Driving  DETAILS
router.get(
  "/screening/:userId/driving_details",
  authMiddleware,
  getDrivingDetails,
);
router.post(
  "/screening/:userId/driving_details",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadDrivingDetails,
);
router.put(
  "/screening/:userId/driving_details",
  authMiddleware,
  updateDrivingDetails,
);
router.patch(
  "/screening/:userId/driving_details",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateDrivingDetailsAuditStatus,
);
//Educational qualification  DETAILS
router.get(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  getEducationalQualification,
);
router.post(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadEducationalQualification,
);
router.put(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  updateEducationalQualification,
);
router.patch(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateEducationalQualificationAuditStatus,
);
router.delete(
  "/screening/:objectId/educational_qualification",
  authMiddleware,
  deleteEducationalQualification,
);

//Emergency Contact  DETAILS
router.get(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  getEmergencyContact,
);
router.post(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadEmergencyContact,
);
router.put(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  updateEmergencyContact,
);
router.patch(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateEmergencyContactAuditStatus,
);

//HEALTH AND SAFETY  DETAILS
router.get(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  getHealthAndSafety,
);
router.post(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadHealthAndSafety,
);
router.put(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  updateHealthAndSafety,
);
router.patch(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateHealthAndSafetyAuditStatus,
);
//HEALTH DECLARATION
router.get(
  "/screening/:userId/health_declarations",
  authMiddleware,
  getHealthDeclaration,
);
router.post(
  "/screening/:userId/health_declarations",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadHealthDeclaration,
);
router.put(
  "/screening/:userId/health_declarations",
  authMiddleware,
  updateHealthDeclaration,
);
router.patch(
  "/screening/:userId/health_declarations",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateHealthDeclarationAuditStatus,
);
//Immunisation  DETAILS
router.get("/screening/:userId/immunisations", authMiddleware, getImmunisation);
router.post(
  "/screening/:userId/immunisations",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadImmunisation,
);
router.put(
  "/screening/:userId/immunisations",
  authMiddleware,
  updateImmunisation,
);
router.patch(
  "/screening/:userId/immunisations",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateImmunisationAuditStatus,
);

//OTHER DECLARATIOB  DETAILS
router.get(
  "/screening/:userId/other_declarations",
  authMiddleware,
  getOtherDeclaration,
);
router.post(
  "/screening/:userId/other_declarations",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadOtherDeclaration,
);
router.put(
  "/screening/:userId/other_declarations",
  authMiddleware,
  updateOtherDeclaration,
);
router.patch(
  "/screening/:userId/other_declarations",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateOtherDeclarationAuditStatus,
);

//PassportPhoto
//PassportPhoto DETAILS;
router.get(
  "/screening/:userId/passport_photo",
  authMiddleware,
  getPassportPhoto,
);
router.post(
  "/screening/:userId/passport_photo",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadPassportPhoto,
);
router.put(
  "/screening/:userId/passport_photo",
  authMiddleware,
  updatePassportPhoto,
);
router.patch(
  "/screening/:userId/passport_photo",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updatePassportPhotoAuditStatus,
);
//Personal Declaration DETAILS;
router.get(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  getPersonalDeclaration,
);
router.post(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadPersonalDeclaration,
);
router.put(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  updatePersonalDeclaration,
);
router.patch(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updatePersonalDeclarationAuditStatus,
);
//PersonalInfo DETAILS;
router.get("/screening/:userId/personal_info", authMiddleware, getPersonalInfo);
router.post(
  "/screening/:userId/personal_info",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadPersonalInfo,
);
// router.put(
//   "/screening/:userId/personal_info",authMiddleware,
//   updatePersonalInfo,
// );
router.patch(
  "/screening/:userId/personal_info",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updatePersonalInfoAuditStatus,
);

//Previous Job  DETAILS
router.get("/screening/:userId/previous_job", authMiddleware, getPreviousJob);
router.post(
  "/screening/:userId/previous_job",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadPreviousJob,
);
router.put(
  "/screening/:userId/previous_job",
  authMiddleware,
  updatePreviousJob,
);
router.patch(
  "/screening/:userId/previous_job",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updatePreviousJobAuditStatus,
);
router.delete(
  "/screening/:objectId/previous_job",
  authMiddleware,
  deletePreviousJob,
);

//Professional Membership DETAILS;
router.get(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  getProfessionalMembership,
);
router.post(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadProfessionalMembership,
);
router.put(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  updateProfessionalMembership,
);
router.patch(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateProfessionalMembershipAuditStatus,
);
//Rehabilitation DETAILS;
router.get(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  getRehabilitation,
);
router.post(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadRehabilitation,
);
router.put(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  updateRehabilitation,
);
router.patch(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateRehabilitationAuditStatus,
);
//Resume DETAILS;
router.get("/screening/:userId/resume", authMiddleware, getResume);
router.post(
  "/screening/:userId/resume",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadResume,
);
router.put("/screening/:userId/resume", authMiddleware, updateResume);
router.patch(
  "/screening/:userId/resume",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateResumeAuditStatus,
);

//Right To Work DETAILS;
router.get("/screening/:userId/right_to_work", authMiddleware, getRightToWork);
router.post(
  "/screening/:userId/right_to_work",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadRightToWork,
);
router.put(
  "/screening/:userId/right_to_work",
  authMiddleware,
  updateRightToWork,
);
router.patch(
  "/screening/:userId/right_to_work",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateRightToWorkAuditStatus,
);

//Working Time DETAILS;
router.get("/screening/:userId/working_time", authMiddleware, getWorkingTime);
router.post(
  "/screening/:userId/working_time",
  authMiddleware,
  upload.any(),
  screeningUploadHandler,
  uploadWorkingTime,
);
router.put(
  "/screening/:userId/working_time",
  authMiddleware,
  updateWorkingTime,
);
router.patch(
  "/screening/:userId/working_time",
  authMiddleware,
  authorizeRoles("super_administrator", "administrator", "recruitment_manager"),
  updateWorkingTimeAuditStatus,
);

export default router;
