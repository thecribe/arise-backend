"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class ContactInfo extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each ContactInfo record belongs to exactly one User
      // `userId` is the foreign key in this table
      ContactInfo.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  ContactInfo.init(
    {
      // Primary key for the table
      id: {
        allowNull: false, // Cannot be NULL
        primaryKey: true, // Primary key
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },

      // User title (Mr, Mrs, Dr, etc.)
      mobile_no: {
        type: DataTypes.STRING,
        // VARCHAR column
      },

      // User's first name
      landline: {
        type: DataTypes.STRING,
        defaultValue: "", // TEXT allows longer values
      },

      // User's last name
      email: {
        type: DataTypes.STRING,
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

      // Foreign key linking this record to a User
      userId: {
        type: DataTypes.UUID, // UUID from User table
        unique: true, // One-to-one relationship
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "ContactInfo", // Model name used internally
      tableName: "forms_contact_info", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return ContactInfo;
};
