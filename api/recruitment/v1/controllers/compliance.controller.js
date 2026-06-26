import db from "../../../../models/index.js";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";

export const uploadComplianceDocuments = async (req, res) => {
  const { staffId } = req.params;

  try {
    const user = await db.User.findOne({
      where: { id: staffId },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User Id is missing",
      });
    }
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const userFolderName = `${user.firstName + "_" + user.lastName}`;
    const uploadDir = `public/static/uploads/other_documents/${userFolderName}`;

    // ensure folder exists

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // const domain = `${req.protocol}://${req.get("host")}`;

    const protocol = req.headers["x-forwarded-proto"] || "https";

    const domain = `${protocol}://${req.get("host")}`;
    const savedDocs = [];

    for (const file of files) {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadDir, uniqueName);

      // write buffer to disk
      fs.writeFileSync(filePath, file.buffer);

      // // save to DB
      const doc = await db.OtherDocuments.create({
        filename: file.originalname,
        url: `${domain}/static/uploads/other_documents/${userFolderName}/${uniqueName}`,
        filetype: file.mimetype,
        filesize: file.size,
        userId: staffId,
      });

      savedDocs.push(doc);
    }

    return res.status(201).json({
      message: "Upload successful",
      documents: savedDocs,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Upload failed" });
  }
};

export const getComplianceDocuments = async (req, res) => {
  const { staffId } = req.params;

  try {
    const documents = await db.OtherDocuments.findAll({
      where: { userId: staffId },
    });

    return res.status(200).json({
      message: "Documents retrieved successfully",
      documents,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to retrieve documents" });
  }
};

export const dbsAndRTWDocuments = async (req, res) => {
  const transaction = await db.sequelize.transaction();

  try {
    const { staffId } = req.params;

    const user = await db.User.findOne({
      where: { id: staffId },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "User not found",
      });
    }

    const { rightToWork, dbsUpdateCheck } = JSON.parse(req.body.data);

    const files = req.files;

    // console.log(files);

    const userFolderName = `${user.firstName}_${user.lastName}`;
    const baseDir = "public/static/uploads/other_documents";
    const uploadDir = `${baseDir}/${userFolderName}`;

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const protocol = req.headers["x-forwarded-proto"] || "https";

    const domain = `${protocol}://${req.get("host")}`;

    /**
     * Helper: handle one compliance type
     */
    const processCompliance = async (type, payload, fileKey) => {
      // 1. Find or create record
      let record = await db.ComplianceRecords.findOne({
        where: {
          userId: staffId,
          type,
        },
        transaction,
      });

      if (!record) {
        record = await db.ComplianceRecords.create(
          {
            userId: staffId,
            type,
            expiryDate: payload.expiryDate || null,
          },
          { transaction },
        );
      } else {
        record.expiryDate = payload.expiryDate;
        await record.save({ transaction });
      }

      /**
       * 2. Delete removed documents
       */
      if (payload.deletedDocuments && payload.deletedDocuments.length > 0) {
        for (const docId of payload.deletedDocuments) {
          const doc = await db.ComplianceDocuments.findOne({
            where: { id: docId, complianceRecordId: record.id },
            transaction,
          });

          if (doc) {
            // delete file from disk
            const filePath = doc.filePath;

            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }

            await doc.destroy({ transaction });
          }
        }
      }

      /**
       * 3. Save existing docs (nothing to do, just kept for clarity)
       */

      /**
       * 4. Handle new uploads
       */
      //   const uploadedFiles = files?.[fileKey] || [];

      const uploadedFiles = Array.isArray(files)
        ? files.filter((f) => f.fieldname === fileKey)
        : [];

      const savedDocs = [];

      for (const file of uploadedFiles) {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, uniqueName);

        fs.writeFileSync(filePath, file.buffer);

        const doc = await db.ComplianceDocuments.create(
          {
            complianceRecordId: record.id,
            originalName: file.originalname,
            fileName: uniqueName,
            filePath: `${domain}/static/uploads/other_documents/${userFolderName}/${uniqueName}`,
            mimeType: file.mimetype,
            fileSize: file.size,
          },
          { transaction },
        );

        savedDocs.push(doc);
      }

      return record;
    };

    /**
     * RIGHT TO WORK
     */
    const rightToWorkRecord = await processCompliance(
      "RIGHT_TO_WORK",
      rightToWork,
      "rightToWorkFiles",
    );

    /**
     * DBS UPDATE CHECK
     */
    const dbsRecord = await processCompliance(
      "DBS_UPDATE_CHECK",
      dbsUpdateCheck,
      "dbsFiles",
    );

    await transaction.commit();

    /**
     * Return full updated data
     */
    const result = await db.ComplianceRecords.findAll({
      where: { userId: staffId },
      include: [
        {
          model: db.ComplianceDocuments,
          as: "documents",
        },
      ],
    });
    const response = {
      rightToWork: {
        expiryDate: "",
        documents: [],
      },

      dbsUpdateCheck: {
        expiryDate: "",
        documents: [],
      },
    };

    result.forEach((record) => {
      const documents = record.documents.map((doc) => ({
        id: doc.id,
        name: doc.originalName,
        url: doc.filePath,
      }));

      if (record.type === "RIGHT_TO_WORK") {
        response.rightToWork = {
          expiryDate: record.expiryDate,
          documents,
        };
      }

      if (record.type === "DBS_UPDATE_CHECK") {
        response.dbsUpdateCheck = {
          expiryDate: record.expiryDate,
          documents,
        };
      }
    });
    return res.status(200).json({
      status: true,
      message: "Compliance updated successfully",
      data: response,
    });
  } catch (error) {
    await transaction.rollback();

    return res.status(500).json({
      status: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getDBSAndRTWDocuments = async (req, res) => {
  try {
    const { staffId } = req.params;

    const user = await db.User.findOne({
      where: { id: staffId },
      attributes: ["id"],
    });

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const complianceRecords = await db.ComplianceRecords.findAll({
      where: {
        userId: staffId,
      },
      include: [
        {
          model: db.ComplianceDocuments,
          as: "documents",
          attributes: [
            "id",
            "originalName",
            "filePath",
            "mimeType",
            "fileSize",
          ],
        },
      ],
    });

    const rightToWork = complianceRecords.find(
      (record) => record.type === "RIGHT_TO_WORK",
    );

    const dbsUpdateCheck = complianceRecords.find(
      (record) => record.type === "DBS_UPDATE_CHECK",
    );

    const response = {
      rightToWork: {
        expiryDate: rightToWork?.expiryDate || "",

        documents:
          rightToWork?.documents?.map((doc) => ({
            id: doc.id,
            name: doc.originalName,
            url: doc.filePath,
            mimeType: doc.mimeType,
            fileSize: doc.fileSize,
          })) || [],
      },

      dbsUpdateCheck: {
        expiryDate: dbsUpdateCheck?.expiryDate || "",

        documents:
          dbsUpdateCheck?.documents?.map((doc) => ({
            id: doc.id,
            name: doc.originalName,
            url: doc.filePath,
            mimeType: doc.mimeType,
            fileSize: doc.fileSize,
          })) || [],
      },
    };

    return res.status(200).json({
      status: true,
      message: "Compliance records retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: false,
      message: "Failed to retrieve compliance records",
      error: error.message,
    });
  }
};

export const allStaffCompliance = async (req, res) => {
  const { departmentSlug } = req.query;

  const where = {};

  if (Object.entries(req.query).length === 0) {
    return res.status(404).json({ message: "Please specify the needed query" });
  }

  Object.entries(req.query).map(([key, value]) => {
    if (value.trim() !== "" && value.trim() !== "all") {
      where[key] = value.trim();
    }
  });

  // const
  const models = [
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

  const otherComplianceModels = [
    { model: "ComplianceRecords", key: "compliance_records" },
  ];
  try {
    const allUsers = await db.User.findAll({
      where: {
        ...where,
        roleSlug: {
          [Op.notIn]: ["applicant", "super_administrator"],
        },
      },
    });

    if (allUsers.length === 0) {
      return res.status(400).json({ message: "Server Error" });
    }

    const allStaffComplianceArray = await Promise.all(
      allUsers.map(async (eachUser) => {
        let userDetails = {
          id: eachUser.id,
          name: `${eachUser.firstName} ${eachUser.lastName}`,
        };

        const formEntries = await Promise.all(
          models.map(async ({ model, key }) => {
            const Model = db[model];
            const entry = await Model.findAll({
              where: { userId: eachUser.id },
            });

            if (entry.length === 0) {
              return { key, value: 0 };
            }

            const average =
              entry.reduce((sum, item) => sum + item.completion_rate, 0) /
              entry.length;

            return { key, value: Math.ceil(average) };
          }),
        );

        formEntries.forEach((entry) => {
          userDetails[entry.key] = entry.value;
        });
        const otherEntries = await Promise.all(
          otherComplianceModels.map(async ({ model, key }) => {
            const Model = db[model];
            const records = await Model.findAll({
              where: { userId: eachUser.id },
              include: [
                {
                  model: db.ComplianceDocuments,
                  as: "documents",
                },
              ],
            });

            if (records.length === 0) {
              userDetails.right_to_work_update_check = {};
              userDetails.dbs_update_check = {};
              return;
            }

            records.forEach((eachRecord) => {
              if (eachRecord.type === "RIGHT_TO_WORK") {
                userDetails.right_to_work_update_check = eachRecord;
              }
              if (eachRecord.type === "DBS_UPDATE_CHECK") {
                userDetails.dbs_update_check = eachRecord;
              }
            });
          }),
        );
        return userDetails;
      }),
    );
    return res.status(200).json({
      message: "yes",
      complianceData: allStaffComplianceArray,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
