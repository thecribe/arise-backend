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
import { authorizeRoles, PERMISSIONS } from "../middleware/role.middleware.js";

const router = express.Router();
const { APPLICATION_FORM } = PERMISSIONS;

//ADDRESS DETAILS
router.get(
  "/screening/:userId/address_details",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getAddress,
);
router.post(
  "/screening/:userId/address_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadAddress,
);
router.put(
  "/screening/:userId/address_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateAddress,
);
router.patch(
  "/screening/:userId/address_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateAuditStatus,
);

//BANK DETAILS
router.get(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getBankDetails,
);
router.post(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadBankDetails,
);
router.put(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateBankDetails,
);
router.patch(
  "/screening/:userId/bank_payment_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateBankDetailsAuditStatus,
);

//CONFIDENTIALITY DETAILS
router.get(
  "/screening/:userId/confidentiality",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getConfidentiality,
);
router.post(
  "/screening/:userId/confidentiality",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadConfidentiality,
);
router.put(
  "/screening/:userId/confidentiality",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateConfidentiality,
);
router.patch(
  "/screening/:userId/confidentiality",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateConfidentilityAuditStatus,
);
//CONSENT DETAILS
router.get("/screening/:userId/consent", authMiddleware, getConsent);
router.post(
  "/screening/:userId/consent",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadConsent,
);
router.put("/screening/:userId/consent", authMiddleware, updateConsent);
router.patch(
  "/screening/:userId/consent",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateConsentAuditStatus,
);

//CONTACT INFO DETAILS
router.get("/screening/:userId/contact", authMiddleware, getContact);
router.post(
  "/screening/:userId/contact",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadContact,
);
router.put("/screening/:userId/contact", authMiddleware, updateContact);
router.patch(
  "/screening/:userId/contact",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateContactAuditStatus,
);

//Current Job DETAILS
router.get("/screening/:userId/current_job", authMiddleware, getCurrentJob);
router.post(
  "/screening/:userId/current_job",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadCurrentJob,
);
router.put("/screening/:userId/current_job", authMiddleware, updateCurrentJob);
router.patch(
  "/screening/:userId/current_job",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateCurrentJobAuditStatus,
);

//Disability  DETAILS
router.get(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getDisability,
);
router.post(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadDisability,
);
router.put(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateDisability,
);
router.patch(
  "/screening/:userId/disability_discrimination_act",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateDisabilityAuditStatus,
);

//Driving  DETAILS
router.get(
  "/screening/:userId/driving_details",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getDrivingDetails,
);
router.post(
  "/screening/:userId/driving_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadDrivingDetails,
);
router.put(
  "/screening/:userId/driving_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateDrivingDetails,
);
router.patch(
  "/screening/:userId/driving_details",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateDrivingDetailsAuditStatus,
);
//Educational qualification  DETAILS
router.get(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getEducationalQualification,
);
router.post(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadEducationalQualification,
);
router.put(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateEducationalQualification,
);
router.patch(
  "/screening/:userId/educational_qualification",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
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
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getEmergencyContact,
);
router.post(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadEmergencyContact,
);
router.put(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateEmergencyContact,
);
router.patch(
  "/screening/:userId/emergency_contact",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateEmergencyContactAuditStatus,
);

//HEALTH AND SAFETY  DETAILS
router.get(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getHealthAndSafety,
);
router.post(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadHealthAndSafety,
);
router.put(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateHealthAndSafety,
);
router.patch(
  "/screening/:userId/health_and_safety",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateHealthAndSafetyAuditStatus,
);
//HEALTH DECLARATION
router.get(
  "/screening/:userId/health_declarations",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getHealthDeclaration,
);
router.post(
  "/screening/:userId/health_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadHealthDeclaration,
);
router.put(
  "/screening/:userId/health_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateHealthDeclaration,
);
router.patch(
  "/screening/:userId/health_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateHealthDeclarationAuditStatus,
);
//Immunisation  DETAILS
router.get("/screening/:userId/immunisations", authMiddleware, getImmunisation);
router.post(
  "/screening/:userId/immunisations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadImmunisation,
);
router.put(
  "/screening/:userId/immunisations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateImmunisation,
);
router.patch(
  "/screening/:userId/immunisations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateImmunisationAuditStatus,
);

//OTHER DECLARATIOB  DETAILS
router.get(
  "/screening/:userId/other_declarations",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getOtherDeclaration,
);
router.post(
  "/screening/:userId/other_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadOtherDeclaration,
);
router.put(
  "/screening/:userId/other_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateOtherDeclaration,
);
router.patch(
  "/screening/:userId/other_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateOtherDeclarationAuditStatus,
);

//PassportPhoto
//PassportPhoto DETAILS;
router.get(
  "/screening/:userId/passport_photo",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getPassportPhoto,
);
router.post(
  "/screening/:userId/passport_photo",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadPassportPhoto,
);
router.put(
  "/screening/:userId/passport_photo",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updatePassportPhoto,
);
router.patch(
  "/screening/:userId/passport_photo",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updatePassportPhotoAuditStatus,
);
//Personal Declaration DETAILS;
router.get(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getPersonalDeclaration,
);
router.post(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadPersonalDeclaration,
);
router.put(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updatePersonalDeclaration,
);
router.patch(
  "/screening/:userId/personal_declarations",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updatePersonalDeclarationAuditStatus,
);
//PersonalInfo DETAILS;
router.get("/screening/:userId/personal_info", authMiddleware, getPersonalInfo);
router.post(
  "/screening/:userId/personal_info",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
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
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updatePersonalInfoAuditStatus,
);

//Previous Job  DETAILS
router.get("/screening/:userId/previous_job", authMiddleware, getPreviousJob);
router.post(
  "/screening/:userId/previous_job",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadPreviousJob,
);
router.put(
  "/screening/:userId/previous_job",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updatePreviousJob,
);
router.patch(
  "/screening/:userId/previous_job",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
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
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getProfessionalMembership,
);
router.post(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadProfessionalMembership,
);
router.put(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateProfessionalMembership,
);
router.patch(
  "/screening/:userId/professional_memberships",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateProfessionalMembershipAuditStatus,
);
//Rehabilitation DETAILS;
router.get(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  authorizeRoles(
    APPLICATION_FORM.CREATE,
    APPLICATION_FORM.UPDATE,
    APPLICATION_FORM.VIEW,
  ),
  getRehabilitation,
);
router.post(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadRehabilitation,
);
router.put(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateRehabilitation,
);
router.patch(
  "/screening/:userId/rehabilitation",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateRehabilitationAuditStatus,
);
//Resume DETAILS;
router.get("/screening/:userId/resume", authMiddleware, getResume);
router.post(
  "/screening/:userId/resume",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadResume,
);
router.put("/screening/:userId/resume", authMiddleware, updateResume);
router.patch(
  "/screening/:userId/resume",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateResumeAuditStatus,
);

//Right To Work DETAILS;
router.get("/screening/:userId/right_to_work", authMiddleware, getRightToWork);
router.post(
  "/screening/:userId/right_to_work",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadRightToWork,
);
router.put(
  "/screening/:userId/right_to_work",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateRightToWork,
);
router.patch(
  "/screening/:userId/right_to_work",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateRightToWorkAuditStatus,
);

//Working Time DETAILS;
router.get("/screening/:userId/working_time", authMiddleware, getWorkingTime);
router.post(
  "/screening/:userId/working_time",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  upload.any(),
  screeningUploadHandler,
  uploadWorkingTime,
);
router.put(
  "/screening/:userId/working_time",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.CREATE, APPLICATION_FORM.UPDATE),
  updateWorkingTime,
);
router.patch(
  "/screening/:userId/working_time",
  authMiddleware,
  authorizeRoles(APPLICATION_FORM.AUDIT),
  updateWorkingTimeAuditStatus,
);

export default router;
