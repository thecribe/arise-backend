"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class Rehabilitation extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each Rehabilitation record belongs to exactly one User
      // `userId` is the foreign key in this table
      Rehabilitation.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  Rehabilitation.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      conviction: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      disciplinary_action: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      criminal_charges: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      consent: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      police_check: {
        type: DataTypes.STRING,
        defaultValue: "",
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
      modelName: "Rehabilitation", // Model name used internally
      tableName: "forms_rehabilitation", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return Rehabilitation;
};
