"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class Visa_Type extends Model {}

  Visa_Type.init(
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
      modelName: "Visa_Type",
      tableName: "visa_types",
      timestamps: true,
    },
  );

  return Visa_Type;
};
