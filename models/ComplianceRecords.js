"use strict";

import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class ComplianceRecords extends Model {
    /**
     * Define model associations.
     */
    static associate(models) {
      // Compliance record belongs to a user
      ComplianceRecords.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "id",
        as: "user",
      });

      // Compliance record can have many documents
      ComplianceRecords.hasMany(models.ComplianceDocuments, {
        foreignKey: "complianceRecordId",
        sourceKey: "id",
        as: "documents",
        onDelete: "CASCADE",
      });
    }
  }

  ComplianceRecords.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      type: {
        type: DataTypes.ENUM("RIGHT_TO_WORK", "DBS_UPDATE_CHECK"),
        allowNull: false,
      },

      expiryDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ComplianceRecords",
      tableName: "compliance_records",
      timestamps: true,
    },
  );

  return ComplianceRecords;
};
