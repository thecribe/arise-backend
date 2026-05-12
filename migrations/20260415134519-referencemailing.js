"use strict";

export async function up(queryInterface, Sequelize) {
  // 1. ReferenceMailStatus Table
  await queryInterface.createTable("reference_mail_status", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    status: {
      type: Sequelize.ENUM(
        "Not sent",
        "Pending",
        "Received",
        "Approved",
        "Rejected",
      ),
      allowNull: false,
      defaultValue: "Not sent",
    },

    referenceId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "forms_reference", // 👈 Change if your main table name differs
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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

  // 2. ReferenceMailResponse Table
  await queryInterface.createTable("reference_mail_responses", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    referenceId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "forms_reference", // 👈 Change if needed
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    reEmploy: {
      type: Sequelize.ENUM("Yes", "No"),
      allowNull: false,
    },

    ratings: {
      type: Sequelize.JSON,
      allowNull: true,
    },

    detailReference: {
      type: Sequelize.TEXT,
      allowNull: true,
    },

    refererName: {
      type: Sequelize.STRING,
      allowNull: true,
    },

    refererSignature: {
      type: Sequelize.STRING,
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
  await queryInterface.dropTable("reference_mail_responses");
  await queryInterface.dropTable("reference_mail_status");
}
