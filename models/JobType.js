"use strict";

import { Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class Job_Type extends Model {}
  Job_Type.init(
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
      modelName: "Job_Type",
      tableName: "job_types",
      timestamps: true,
    },
  );
  return Job_Type;
};
