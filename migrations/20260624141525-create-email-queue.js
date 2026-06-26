"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("email_queues", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    payload: {
      type: Sequelize.JSON,
      allowNull: false,
    },

    status: {
      type: Sequelize.ENUM("pending", "processing", "sent", "failed"),
      allowNull: false,
      defaultValue: "pending",
    },

    attempts: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    error: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    processedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });

  await queryInterface.addIndex("email_queues", ["status", "attempts"]);
}
export async function down(queryInterface) {
  await queryInterface.dropTable("email_queues");
}
