"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class ProfessionalMembership extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each ProfessionalMembership record belongs to exactly one User
      // `userId` is the foreign key in this table
      ProfessionalMembership.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  ProfessionalMembership.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User's first name
      body_type: {
        type: DataTypes.STRING,
        defaultValue: "", // STRING allows longer values
      },

      // User's last name
      pin: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      renewal_date: {
        type: DataTypes.DATE,
      },

      // Gender field (free STRING)
      dbs_disclosure: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      issue_date: {
        type: DataTypes.DATE,
      },

      // Employee internal identifier
      clear: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      disclosure_number: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      certificate_registration: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      membership_card_upload: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },
      current_dbs_upload: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },
      dbs_update_check: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },

      // Country of origin or residence
      expiry_date: {
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
      // Date of birth (stored as STRING — consider DATE in future)

      // Foreign key linking this record to a User
      userId: {
        type: DataTypes.UUID, // UUID from User table
        unique: true, // One-to-one relationship
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "ProfessionalMembership", // Model name used internally
      tableName: "forms_professional_membership", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return ProfessionalMembership;
};
