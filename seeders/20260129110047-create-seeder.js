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
  await queryInterface.bulkInsert("visa_types", [
    {
      title: "Uncategorised",
      slug: "uncategorised",
    },
  ]);
  await queryInterface.bulkInsert("departments", [
    {
      title: "Uncategorised",
      slug: "uncategorised",
    },
  ]);
  await queryInterface.bulkInsert("roles", [
    { role: "Super Administrator", slug: "super_administrator" },
    { role: "Administrator", slug: "administrator" },
    { role: "Applicant", slug: "applicant" },
    { role: "Client", slug: "client" },
    { role: "Staff", slug: "staff" },
    { role: "Recruitment Manager", slug: "recruitment_manager" },
  ]);
  await queryInterface.bulkInsert("users", [
    {
      id: "86de905d-2634-4cea-9bf1-0c088ff34d79",
      firstName: "Admin",
      lastName: "Admin",
      email: "lawaloluwatobi128@gmail.com",
      password: null,
      roleSlug: "super_administrator",
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
   * await queryInterface.bulkDelete('People', null, {});
   */
  queryInterface.bulkDelete("visa_types", null, {});
  queryInterface.bulkDelete("department", null, {});
  queryInterface.bulkDelete("roles", null, {});
  queryInterface.bulkDelete("users", null, {});
}
