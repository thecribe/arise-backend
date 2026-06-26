"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable("compliance_documents", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    complianceRecordId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "compliance_records",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    originalName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    fileName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    filePath: {
      type: Sequelize.TEXT,
      allowNull: false,
    },

    mimeType: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    fileSize: {
      type: Sequelize.BIGINT,
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
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.dropTable("compliance_documents");
}
