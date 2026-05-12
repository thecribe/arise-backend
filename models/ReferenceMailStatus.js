"use strict";

import { DataTypes, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class ReferenceMailStatus extends Model {
    static associate(models) {
      // Each Confidentility record belongs to exactly one User
      // `userId` is the foreign key in this table

      ReferenceMailStatus.belongsTo(models.Reference, {
        foreignKey: "referenceId", // Column in forms_personal_info
        targetKey: "id",
        as: "mail_status", // Column in users table
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  ReferenceMailStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      status: {
        type: DataTypes.ENUM(
          "Not sent",
          "Pending",
          "Received",
          "Approved",
          "Rejected",
        ),
        allowNull: false,
        defaultValue: "Not sent",
      },

      referenceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ReferenceMailStatus",
      tableName: "reference_mail_status",
      timestamps: true,
    },
  );
  return ReferenceMailStatus;
};
