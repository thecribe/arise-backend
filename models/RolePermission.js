"use strict";

import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class RolePermission extends Model {
    static associate(models) {
      RolePermission.belongsTo(models.Role, {
        foreignKey: "roleSlug",
        targetKey: "slug",
        as: "roles",
      });

      RolePermission.belongsTo(models.Permission, {
        foreignKey: "permissionId",
        targetKey: "id",
        as: "permissions",
      });
    }
  }

  RolePermission.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      roleSlug: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "roles",
          key: "slug",
        },
      },

      permissionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "permissions",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "RolePermission",
      tableName: "role_permissions",
      timestamps: true,
    },
  );

  return RolePermission;
};
