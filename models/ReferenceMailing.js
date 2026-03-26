"use strict";

import { DataTypes, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class ReferenceMailing extends Model {
    static associate(models) {
      // Each Confidentility record belongs to exactly one User
      // `userId` is the foreign key in this table
      ReferenceMailing.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
      ReferenceMailing.belongsTo(models.Reference, {
        foreignKey: "referenceId", // Column in forms_personal_info
        targetKey: "id",
        as: "reference_id", // Column in users table
      });
    }
  }
  ReferenceMailing.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },
      response: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      sent: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      rejected: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      referenceId: {
        type: DataTypes.UUID, // UUID from User table
        unique: true, // One-to-one relationship
      },
      userId: {
        type: DataTypes.UUID, // UUID from User table
        unique: true, // One-to-one relationship
      },
    },
    {
      sequelize,
      modelName: "ReferenceMailing",
      tableName: "forms_reference_mailing",
      timestamps: true,
    },
  );
  return ReferenceMailing;
};
