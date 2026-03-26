"use strict";

import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "roleSlug",
        targetKey: "slug",
        as: "role",
      });

      // Optional (if you later want visa/job relations from this table)
      User.belongsTo(models.Department, {
        foreignKey: "departmentSlug",
        targetKey: "slug",
        as: "department",
      });

      User.belongsTo(models.Job_Type, {
        foreignKey: "jobTypeSlug",
        targetKey: "slug",
        as: "jobType",
      });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      phone: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      roleSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "applicant",
      },
      departmentSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "uncategorised",
      },
      jobTypeSlug: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "uncategorised",
      },
      address: {
        type: DataTypes.STRING,
      },
      profileImage: {
        type: DataTypes.TEXT,
      },
    },

    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    },
  );
  return User;
};
