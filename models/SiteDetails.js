"use strict";

import { DataTypes, Model } from "sequelize";
export default (sequelize, DataTypes) => {
  class SiteDetails extends Model {}

  SiteDetails.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      title: {
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.TEXT,
      },
      admin_email: {
        type: DataTypes.STRING,
      },
      site_logo: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "SiteDetails",
      tableName: "site_details",
      timestamps: true,
    },
  );
  return SiteDetails;
};
