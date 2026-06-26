"use strict";

import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class Permission extends Model {
    /**
     * Define associations
     */
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        sourceKey: "id",
        targetKey: "slug",
        as: "roles",
      });
    }
  }

  Permission.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      resource: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.action} ${this.resource}`;
        },
      },

      description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
      timestamps: true,
    },
  );

  return Permission;
};
