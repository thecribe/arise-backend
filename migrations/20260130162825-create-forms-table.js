"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable("forms_consent", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // Country of origin or residence
    signature: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    date: {
      type: Sequelize.DATE,
    },

    completion_rate: {
      type: Sequelize.DECIMAL(4, 1),
      defaultValue: 0,
    },
    audit_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    // Date of birth (stored as STRING — consider DATE in future)
    // Foreign key linking this record to a User
    userId: {
      type: Sequelize.UUID, // UUID from User table
      unique: true,
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

  await queryInterface.createTable("forms_contact_info", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User title (Mr, Mrs, Dr, etc.)
    mobile_no: {
      type: Sequelize.STRING,
      // VARCHAR column
    },

    // User's first name
    landline: {
      type: Sequelize.STRING,
      defaultValue: "", // TEXT allows longer values
    },

    // User's last name
    email: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    completion_rate: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    audit_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    // Foreign key linking this record to a User
    userId: {
      type: Sequelize.UUID, // UUID from User table
      unique: true,
      allowNull: false,
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
  await queryInterface.createTable("forms_current_job", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    job_title: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    // User's last name
    current_place_of_work: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Gender field (free STRING)
    current_pay: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Employee internal identifier
    shift: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Country of origin or residence
    duties: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },
    completion_rate: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    audit_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: Sequelize.UUID, // UUID from User table
      unique: true,
      allowNull: false,
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
  await queryInterface.createTable("forms_disability_act", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    disability: {
      type: Sequelize.STRING,
      defaultValue: "uncategorised", // STRING allows longer values
    },

    // Country of origin or residence
    signature: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    date: {
      type: Sequelize.DATE,
    },

    completion_rate: {
      type: Sequelize.DECIMAL(4, 1),
      defaultValue: 0,
    },
    audit_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: Sequelize.UUID, // UUID from User table
      unique: true,
      allowNull: false,
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
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   * await queryInterface.dropTable('users');
   */
  await queryInterface.dropTable("consent");
  await queryInterface.dropTable("forms_contact_info");
  await queryInterface.dropTable("forms_current_job");
  await queryInterface.dropTable("forms_disability_act");
}
