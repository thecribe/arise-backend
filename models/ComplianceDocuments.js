"use strict";

import { DataTypes, Model } from "sequelize";

export default (sequelize) => {
  class ComplianceDocuments extends Model {
    /**
     * Define model associations.
     */
    static associate(models) {
      // Document belongs to a compliance record
      ComplianceDocuments.belongsTo(models.ComplianceRecords, {
        foreignKey: "complianceRecordId",
        targetKey: "id",
        as: "complianceRecord",
      });
    }
  }

  ComplianceDocuments.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      complianceRecordId: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      originalName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      fileName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      filePath: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      mimeType: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      fileSize: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ComplianceDocuments",
      tableName: "compliance_documents",
      timestamps: true,
    },
  );

  return ComplianceDocuments;
};
