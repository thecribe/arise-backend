"use strict";

/** @type {import('sequelize-cli').Migration} */

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("users", {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },

    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },

    emailVerified: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    phone: {
      type: Sequelize.STRING,
    },

    password: {
      type: Sequelize.STRING,
    },

    roleSlug: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "applicant",
      references: {
        model: "roles",
        key: "slug",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    },

    departmentSlug: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "uncategorised",
      references: {
        model: "departments",
        key: "slug",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    },

    jobTypeSlug: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "uncategorised",
      references: {
        model: "job_types",
        key: "slug",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    },

    address: {
      type: Sequelize.STRING,
    },

    profileImage: {
      type: Sequelize.TEXT,
    },

    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },

    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ),
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("users");
}
