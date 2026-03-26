"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class CurrentJob extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each CurrentJob record belongs to exactly one User
      // `userId` is the foreign key in this table
      CurrentJob.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  CurrentJob.init(
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
      current_place_of_work: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Gender field (free STRING)
      current_pay: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Employee internal identifier
      shift: {
        type: DataTypes.STRING,
        defaultValue: "",
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
        unique: true, // One-to-one relationship
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "CurrentJob", // Model name used internally
      tableName: "forms_current_job", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return CurrentJob;
};
