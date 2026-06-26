"use strict";

// Import Sequelize data types (STRING, INTEGER, UUID, etc.)
import { Model } from "sequelize";

// Import the configured Sequelize instance (DB connection)
export default (sequelize, DataTypes) => {
  class EmailQueues extends Model {
    /**
     * This method defines all relationships for this model.
     * Sequelize will call it automatically from models/index.js
     */
    static associate(models) {}
  }

  /**
   * Initialize the model (table structure)
   */
  EmailQueues.init(
    {
      // Primary key for the table
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      payload: {
        type: DataTypes.JSON,
        allowNull: false,
      },

      status: {
        type: DataTypes.ENUM("pending", "processing", "sent", "failed"),
        defaultValue: "pending",
      },

      attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },

      error: {
        type: DataTypes.TEXT,
      },

      processedAt: {
        type: DataTypes.DATE,
      },
    },

    {
      sequelize, // Sequelize instance (DB connection)
      modelName: "EmailQueues", // Model name used internally
      tableName: "email_queues", // Exact table name in DB
      timestamps: true, // Adds createdAt & updatedAt
    },
  );
  return EmailQueues;
};
