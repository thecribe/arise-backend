"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("permissions", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    resource: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    action: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    description: {
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

  await queryInterface.addConstraint("permissions", {
    fields: ["resource", "action"],
    type: "unique",
    name: "permissions_resource_action_unique",
  });

  await queryInterface.createTable("role_permissions", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },

    roleSlug: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "roles",
        key: "slug",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    permissionId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: "permissions",
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

  await queryInterface.addConstraint("role_permissions", {
    fields: ["roleSlug", "permissionId"],
    type: "unique",
    name: "role_permissions_unique",
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("permissions");
  await queryInterface.dropTable("role_permissions");
}
