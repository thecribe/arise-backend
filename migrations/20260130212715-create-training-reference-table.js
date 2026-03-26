"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable("forms_mandatory_certificate", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },

    // Country of origin or residence
    name: {
      type: Sequelize.STRING,
      defaultValue: "",
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
  await queryInterface.createTable("forms_applicant_certificate", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },

    // Country of origin or residence
    name: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    lifetime: {
      type: Sequelize.STRING,
      defaultValue: "No",
    },
    issue_date: {
      type: Sequelize.DATE,
    },
    expiry_date: {
      type: Sequelize.DATE,
    },
    file: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    userId: {
      type: Sequelize.UUID, // UUID from User table
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    },
    mandatory_certificateId: {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: "forms_mandatory_certificate",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
    },
    completion_rate: {
      type: Sequelize.DECIMAL(4, 1),
      defaultValue: 0,
    },
    audit_status: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
  await queryInterface.createTable("forms_reference", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
    },
    company_name: {
      type: Sequelize.STRING,
    },
    from_date: {
      type: Sequelize.DATEONLY,
    },
    to_date: {
      type: Sequelize.DATEONLY,
    },
    referee_name: {
      type: Sequelize.STRING,
    },
    referee_email: {
      type: Sequelize.STRING,
    },
    referee_phone: {
      type: Sequelize.STRING,
    },
    referee_relationship: {
      type: Sequelize.STRING,
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
  await queryInterface.createTable("forms_reference_mailing", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
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
      type: Sequelize.UUID, // UUID from User table
      unique: true, // One-to-one relationship
      references: {
        model: "forms_reference",
        key: "id",
      },
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
  await queryInterface.createTable("forms_reference_mail_response", {
    id: {
      allowNull: false,
      primaryKey: true,
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
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
      type: Sequelize.UUID, // UUID from User table
      unique: true, // One-to-one relationship
      references: {
        model: "forms_reference",
        key: "id",
      },
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
  await queryInterface.dropTable("forms_reference_mailing");
  await queryInterface.dropTable("forms_reference_mail_response");
  await queryInterface.dropTable("forms_reference");
  await queryInterface.dropTable("forms_applicant_certificate");
  await queryInterface.dropTable("forms_mandatory_certificate");
}
