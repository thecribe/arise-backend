"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const table = await queryInterface.describeTable("forms_confidentility");

  // ✅ Add userId only if it doesn't exist
  if (!table.userId) {
    await queryInterface.addColumn("forms_confidentility", "userId", {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    });
  }

  // ✅ Add createdAt only if it doesn't exist
  if (!table.createdAt) {
    await queryInterface.addColumn("forms_confidentility", "createdAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });
  }

  // ✅ Add updatedAt only if it doesn't exist
  if (!table.updatedAt) {
    await queryInterface.addColumn("forms_confidentility", "updatedAt", {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ),
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const table = await queryInterface.describeTable("forms_confidentility");

  // Remove in reverse order safely
  if (table.updatedAt) {
    await queryInterface.removeColumn("forms_confidentility", "updatedAt");
  }

  if (table.createdAt) {
    await queryInterface.removeColumn("forms_confidentility", "createdAt");
  }

  if (table.userId) {
    await queryInterface.removeColumn("forms_confidentility", "userId");
  }
}
