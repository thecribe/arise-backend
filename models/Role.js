"use strict";

import { DataTypes, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Role extends Model {}
  Role.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      timestamps: true,
    },
  );
  return Role;
};
