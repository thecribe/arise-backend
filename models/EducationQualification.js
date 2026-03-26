"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class EducationQualification extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each EducationQualification record belongs to exactly one User
      // `userId` is the foreign key in this table
      EducationQualification.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  EducationQualification.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User's first name
      establishment: {
        type: DataTypes.STRING,
        defaultValue: "", // STRING allows longer values
      },

      // User's last name
      from_date: {
        type: DataTypes.DATE,
      },

      to_date: {
        type: DataTypes.DATE,
      },

      qualification: {
        type: DataTypes.STRING,
        defaultValue: "", // STRING allows longer values
      },

      grade: {
        type: DataTypes.STRING,
        defaultValue: "", // STRING allows longer values
      },

      photo_cert: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },

      // Gender field (free STRING)
      completion_rate: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      audit_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Date of birth (stored as STRING — consider DATE in future)

      // Foreign key linking this record to a User
      userId: {
        type: DataTypes.UUID, // UUID from User table
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "EducationQualification", // Model name used internally
      tableName: "forms_educational_qualification", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return EducationQualification;
};
