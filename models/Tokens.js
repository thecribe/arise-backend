"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each Token record belongs to exactly one User
      // `userId` is the foreign key in this table
      Token.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
        onDelete: "SET NULL",
        onUpdate: "CASCADE", // If a user's ID changes, update it in Tokens
      });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  Token.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      // Country of origin or residence
      token: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      revokedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID, // UUID from User table
        allowNull: true,
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "Token", // Model name used internally
      tableName: "tokens", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return Token;
};
