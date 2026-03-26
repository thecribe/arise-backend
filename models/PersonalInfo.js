"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class PersonalInfo extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each PersonalInfo record belongs to exactly one User
      // `userId` is the foreign key in this table
      PersonalInfo.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });

      // Optional (if you later want visa/job relations from this table)
      PersonalInfo.belongsTo(models.Visa_Type, {
        foreignKey: "visa_type",
        targetKey: "slug",
        as: "visaType",
      });

      PersonalInfo.belongsTo(models.Job_Type, {
        foreignKey: "job_type",
        targetKey: "slug",
        as: "jobType",
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  PersonalInfo.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User title (Mr, Mrs, Dr, etc.)
      title: {
        type: DataTypes.STRING,
        defaultValue: "", // VARCHAR column
      },

      // User's first name
      firstName: {
        type: DataTypes.TEXT,
        defaultValue: "", // TEXT allows longer values
      },

      // User's last name
      lastName: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },

      // Gender field (free text)
      gender: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Employee internal identifier
      employee_id: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Country of origin or residence
      country: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Date of birth (stored as STRING — consider DATE in future)
      birthday: {
        type: DataTypes.DATE,
      },

      completion_rate: {
        type: DataTypes.DECIMAL(4, 1),
        defaultValue: 0,
      },
      audit_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      // Visa type reference (slug-based relation)
      visa_type: {
        allowNull: false, // Required field
        type: DataTypes.STRING,
        defaultValue: "uncategorised", // Fallback value
      },

      // Job type reference (slug-based relation)
      job_type: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "uncategorised",
      },

      // Foreign key linking this record to a User
      userId: {
        type: DataTypes.UUID, // UUID from User table
        unique: true, // One-to-one relationship
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "PersonalInfo", // Model name used internally
      tableName: "forms_personal_info", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return PersonalInfo;
};
