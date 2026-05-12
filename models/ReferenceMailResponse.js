"use strict";

import { DataTypes, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class ReferenceMailResponse extends Model {
    static associate(models) {
      // Each Confidentility record belongs to exactly one User
      // `userId` is the foreign key in this table

      ReferenceMailResponse.belongsTo(models.Reference, {
        foreignKey: "referenceId", // Column in forms_personal_info
        targetKey: "id",
        as: "reference_details", // Column in users table
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  ReferenceMailResponse.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      referenceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      reEmploy: {
        type: DataTypes.ENUM("Yes", "No"),
        allowNull: false,
      },

      ratings: {
        type: DataTypes.JSON,
        allowNull: true,
      },

      detailReference: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      refererName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      refererSignature: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ReferenceMailResponse",
      tableName: "reference_mail_responses",
      timestamps: true,
    },
  );
  return ReferenceMailResponse;
};
