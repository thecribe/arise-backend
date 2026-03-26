"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { DataTypes, Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class MandatoryCertificate extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {
      // Each MandatoryCertificate record belongs to exactly one User
      // `userId` is the foreign key in this table
      // MandatoryCertificate.belongsTo(models.User, {
      //   foreignKey: "userId", // Column in forms_personal_info
      //   targetKey: "id", // Column in users table
      // });
    }
  }

  /**
   * Initialize the model (table structure)
   */
  MandatoryCertificate.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },

      // Country of origin or residence
      name: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "MandatoryCertificate", // Model name used internally
      tableName: "forms_mandatory_certificate", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return MandatoryCertificate;
};
