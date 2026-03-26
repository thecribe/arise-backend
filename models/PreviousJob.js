"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class PreviousJob extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each PreviousJob record belongs to exactly one User
      // `userId` is the foreign key in this table
      PreviousJob.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  PreviousJob.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User's first name
      job_title: {
        type: DataTypes.STRING,
        defaultValue: "", // STRING allows longer values
      },

      // User's last name
      name_of_employer: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Gender field (free STRING)
      address: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Employee internal identifier
      reason_for_leaving: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      from_date: {
        type: DataTypes.DATE,
      },
      to_date: {
        type: DataTypes.DATE,
      },

      // Country of origin or residence
      duties: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
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
      modelName: "PreviousJob", // Model name used internally
      tableName: "forms_previous_job", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return PreviousJob;
};
