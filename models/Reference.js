"use strict";

import { DataTypes, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Reference extends Model {
    static associate(models) {
      // Each Confidentility record belongs to exactly one User
      // `userId` is the foreign key in this table
      Reference.belongsTo(models.User, {
        foreignKey: "userId", // Column in forms_personal_info
        targetKey: "id",
        as: "user", // Column in users table
      });
    }
  }
  Reference.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      company_name: {
        type: DataTypes.STRING,
      },
      from_date: {
        type: DataTypes.DATEONLY,
      },
      to_date: {
        type: DataTypes.DATEONLY,
      },
      referee_name: {
        type: DataTypes.STRING,
      },
      referee_email: {
        type: DataTypes.STRING,
      },
      referee_phone: {
        type: DataTypes.STRING,
      },
      referee_relationship: {
        type: DataTypes.STRING,
      },
      completion_rate: {
        type: DataTypes.DECIMAL(4, 1),
        defaultValue: 0,
      },
      audit_status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      userId: {
        type: DataTypes.UUID, // UUID from User table
      },
    },
    {
      sequelize,
      modelName: "Reference",
      tableName: "forms_reference",
      timestamps: true,
    },
  );
  return Reference;
};
