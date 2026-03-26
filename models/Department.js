"use strict";

import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Department extends Model {}
  Department.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER.UNSIGNED, // Positive integer only
        autoIncrement: true, // Auto-increment value
      },
      title: {
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
      modelName: "Department",
      tableName: "departments",
      timestamps: true,
    },
  );
  return Department;
};
