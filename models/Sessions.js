"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class Session extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each Session record belongs to exactly one User
      // `userId` is the foreign key in this table
      Session.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
        onDelete: "SET NULL",
        onUpdate: "CASCADE", // If a user's ID changes, update it in sessions
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  Session.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      // Country of origin or residence
      refreshToken: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID, // UUID from User table
        allowNull: true,
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "Session", // Model name used internally
      tableName: "sessions", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return Session;
};
