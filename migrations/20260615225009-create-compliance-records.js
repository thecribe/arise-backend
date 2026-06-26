"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("compliance_records", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },

    type: {
      type: Sequelize.ENUM("RIGHT_TO_WORK", "DBS_UPDATE_CHECK"),
      allowNull: false,
    },

    expiryDate: {
      type: Sequelize.DATEONLY,
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

  await queryInterface.addIndex("compliance_records", ["userId", "type"], {
    unique: true,
  });

  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */

  await queryInterface.dropTable("compliance_records");
}
