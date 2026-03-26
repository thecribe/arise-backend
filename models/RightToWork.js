"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class RightToWork extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each RightToWork record belongs to exactly one User
      // `userId` is the foreign key in this table
      RightToWork.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  RightToWork.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User's first name
      entitlement: {
        type: DataTypes.STRING,
        defaultValue: "uncategorised", // STRING allows longer values
      },

      // User's last name
      passport_number: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Gender field (free STRING)
      expiry_date: {
        type: DataTypes.DATE,
      },
      share_code: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Country of origin or residence
      passport_proof: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },
      brp_proof: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },
      right_to_work_update_check: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
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
      modelName: "RightToWork", // Model name used internally
      tableName: "forms_right_to_work", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return RightToWork;
};
