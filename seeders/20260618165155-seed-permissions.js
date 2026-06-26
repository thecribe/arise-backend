"use strict";
import { randomUUID } from "crypto";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const resources = [
    "role",
    "application-form",
    "department",
    "jobtype",
    "compliance",
    "user",
    "certificate",
    "reference",

    "site-details",
  ];

  const actions = ["view", "create", "update", "delete"];

  const permissions = [
    {
      id: randomUUID(),
      resource: "application-form",
      action: "audit",
      description: `${"audit"} ${"application-form"}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      resource: "reference_mail",
      action: "view",
      description: `${"view"} ${"reference_mail"}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      resource: "reference_mail",
      action: "upload",
      description: `${"upload"} ${"reference_mail"}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      resource: "reference_mail",
      action: "send",
      description: `${"send"} ${"reference_mail"}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  resources.forEach((resource) => {
    actions.forEach((action) => {
      permissions.push({
        id: randomUUID(),
        resource,
        action,
        description: `${action} ${resource}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
  });

  await queryInterface.bulkInsert("permissions", permissions);
}

export async function down(queryInterface) {
  await queryInterface.bulkDelete("permissions", null, {});
}
