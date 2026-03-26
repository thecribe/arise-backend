"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class Immunisation extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each Immunisation record belongs to exactly one User
      // `userId` is the foreign key in this table
      Immunisation.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  Immunisation.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User's first name
      hep_b: {
        type: DataTypes.STRING,
      },
      hep_b_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },

      tb: {
        type: DataTypes.STRING,
      },
      tb_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },

      varicella: {
        type: DataTypes.STRING,
      },
      varicella_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },
      measles: {
        type: DataTypes.STRING,
      },
      measles_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },
      rubella: {
        type: DataTypes.STRING,
      },
      rubella_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },
      hep_b_antigen: {
        type: DataTypes.STRING,
      },
      hep_b_antigen_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },
      hep_c: {
        type: DataTypes.STRING,
      },
      hep_c_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },
      hiv: {
        type: DataTypes.STRING,
      },
      hiv_certificate: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
      },
      signature: {
        type: DataTypes.TEXT,
        defaultValue: "[]", // STRING allows longer values
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
      modelName: "Immunisation", // Model name used internally
      tableName: "forms_immunisation", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return Immunisation;
};
