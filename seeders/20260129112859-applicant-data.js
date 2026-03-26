"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add seed commands here.
   *
   * Example:
   * await queryInterface.bulkInsert('People', [{
   *   name: 'John Doe',
   *   isBetaMember: false
   * }], {});
   */
  await queryInterface.bulkInsert("users", [
    {
      id: "5bd9bbd7-ac6e-44b6-98be-5a0702446d1d",
      firstName: "Lawal",
      lastName: "James",
      email: "apiskye98@gmail.com",
      password: null,
      roleSlug: "applicant",
      address: "",
      profileImage: "[]",
      departmentSlug: "uncategorised",
    },
  ]);
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add commands to revert seed here.
   *
   * Example:
   */
  // await queryInterface.bulkDelete("users", null, {});
}
