"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class HealthAndSafety extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each HealthAndSafety record belongs to exactly one User
      // `userId` is the foreign key in this table
      HealthAndSafety.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  HealthAndSafety.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // Country of origin or residence
      signature: {
        type: DataTypes.TEXT,
        defaultValue: "[]",
      },
      date: {
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
      modelName: "HealthAndSafety", // Model name used internally
      tableName: "forms_health_safety", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return HealthAndSafety;
};
