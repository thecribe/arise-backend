"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each Address record belongs to exactly one User
      // `userId` is the foreign key in this table
      Address.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  Address.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User title (Mr, Mrs, Dr, etc.)
      house_number: {
        type: DataTypes.STRING,
        // VARCHAR column
      },

      // User's first name
      address: {
        type: DataTypes.TEXT,
        defaultValue: "", // TEXT allows longer values
      },

      // User's last name
      city: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },

      // Gender field (free text)
      state: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Employee internal identifier
      postal_code: {
        type: DataTypes.STRING,
        defaultValue: "",
      },

      // Country of origin or residence
      country: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      // Date of birth (stored as STRING — consider DATE in future)
      from_date: {
        type: DataTypes.DATE,
      },
      to_date: {
        type: DataTypes.DATE,
      },
      proof_of_address: {
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
      // Foreign key linking this record to a User
      userId: {
        type: DataTypes.UUID, // UUID from User table
        unique: true, // One-to-one relationship
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "Address", // Model name used internally
      tableName: "forms_address", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return Address;
};
