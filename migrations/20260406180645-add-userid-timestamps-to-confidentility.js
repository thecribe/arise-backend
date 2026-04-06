"use strict";
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  // Add userId (foreign key to users table)
  await queryInterface.addColumn("forms_confidentility", "userId", {
    type: Sequelize.UUID,
    unique: true,
    allowNull: false,
    references: {
      model: "users", // table name
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET DEFAULT", // Consider changing to 'CASCADE' or 'RESTRICT'
  });

  // Add createdAt
  await queryInterface.addColumn("forms_confidentility", "createdAt", {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  });

  // Add updatedAt
  await queryInterface.addColumn("forms_confidentility", "updatedAt", {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal(
      "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
    ),
  });
}
export async function down(queryInterface, Sequelize) {
  // Revert changes (remove columns in reverse order)
  await queryInterface.removeColumn("forms_confidentility", "updatedAt");
  await queryInterface.removeColumn("forms_confidentility", "createdAt");
  await queryInterface.removeColumn("forms_confidentility", "userId");
}
