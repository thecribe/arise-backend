"use strict";
import { DataTypes, Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class OtherDocuments extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each OtherDocuments record belongs to exactly one User
      // `userId` is the foreign key in this table
      OtherDocuments.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }
  OtherDocuments.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      filetype: {
        type: DataTypes.STRING,
      },

      filesize: {
        type: DataTypes.INTEGER,
      },
      userId: {
        type: DataTypes.UUID, // UUID from User table
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "OtherDocuments", // Model name used internally
      tableName: "other_documents", // Exact table name in DB
      timestamps: true, // Automatically add createdAt and updatedAt fields
    },
  );

  return OtherDocuments;
};
