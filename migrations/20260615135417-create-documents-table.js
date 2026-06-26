"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable("other_documents", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },

    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    url: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    filetype: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    filesize: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },

    userId: {
      type: Sequelize.UUID, // UUID from User table
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    }, // One-to-one relationship
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
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
  await queryInterface.dropTable("other_documents");
}
