"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Drop child tables first (important if there are FK constraints)
  await queryInterface.dropTable("forms_reference_mail_response");
  await queryInterface.dropTable("forms_reference_mailing");
}

export async function down(queryInterface, Sequelize) {
  // Recreate the tables (for rollback)

  await queryInterface.createTable("forms_reference_mailing", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    response: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    sent: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    rejected: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    referenceId: {
      type: Sequelize.UUID,
      unique: true,
      references: {
        model: "forms_reference",
        key: "id",
      },
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
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

  await queryInterface.createTable("forms_reference_mail_response", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
    },
    response: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    sent: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    rejected: {
      allowNull: false,
      type: Sequelize.DATEONLY,
    },
    referenceId: {
      type: Sequelize.UUID,
      unique: true,
      references: {
        model: "forms_reference",
        key: "id",
      },
    },
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
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
