"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class ApplicantsCertificates extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each ApplicantsCertificates record belongs to exactly one User
      // `userId` is the foreign key in this table
      ApplicantsCertificates.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
      ApplicantsCertificates.belongsTo(models.MandatoryCertificate, {
        foreignKey: "mandatory_certificateId",
        targetKey: "id",
        as: "mandatory_certificate_id", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  ApplicantsCertificates.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      // Country of origin or residence
      name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      lifetime: {
        type: DataTypes.STRING,
        defaultValue: "No",
      },
      issue_date: {
        type: DataTypes.DATE,
      },
      expiry_date: {
        type: DataTypes.DATE,
      },
      file: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      mandatory_certificateId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      completion_rate: {
        type: DataTypes.DECIMAL(4, 1),
        defaultValue: 0,
      },
      audit_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "ApplicantsCertificates", // Model name used internally
      tableName: "forms_applicant_certificate", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return ApplicantsCertificates;
};
