"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  /**
   * Add altering commands here.
   *
   * Example:
   * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
   */
  await queryInterface.createTable("forms_driving_details", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    driver_license: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    // User's last name
    posess_car: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Gender field (free STRING)
    front_side_license: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    back_side_license: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },

    // Employee internal identifier

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
  await queryInterface.createTable("forms_educational_qualification", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    establishment: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    // User's last name
    from_date: {
      type: Sequelize.DATE,
    },

    to_date: {
      type: Sequelize.DATE,
    },

    qualification: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    grade: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    photo_cert: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },

    // Gender field (free STRING)
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
  await queryInterface.createTable("forms_emergency_contact", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    next_of_kin: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    // User's last name
    relationship: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Gender field (free STRING)
    address: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Employee internal identifier
    city: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Country of origin or residence
    state: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    postal_code: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    country: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    mobile_no: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
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
  await queryInterface.createTable("forms_health_safety", {
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
  await queryInterface.createTable("forms_health_declaration", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    name: {
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
  await queryInterface.createTable("forms_immunisation", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    hep_b: {
      type: Sequelize.STRING,
    },
    hep_b_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },

    tb: {
      type: Sequelize.STRING,
    },
    tb_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },

    varicella: {
      type: Sequelize.STRING,
    },
    varicella_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    measles: {
      type: Sequelize.STRING,
    },
    measles_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    rubella: {
      type: Sequelize.STRING,
    },
    rubella_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    hep_b_antigen: {
      type: Sequelize.STRING,
    },
    hep_b_antigen_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    hep_c: {
      type: Sequelize.STRING,
    },
    hep_c_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    hiv: {
      type: Sequelize.STRING,
    },
    hiv_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    signature: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
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
  await queryInterface.createTable("forms_other_declarations", {
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
  await queryInterface.createTable("forms_passports", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    passport: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    proof_of_insurance: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
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
  await queryInterface.createTable("forms_personal_declaration", {
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
  await queryInterface.createTable("forms_personal_info", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User title (Mr, Mrs, Dr, etc.)
    title: {
      type: Sequelize.STRING,
      defaultValue: "", // VARCHAR column
    },

    // User's first name
    firstName: {
      type: Sequelize.TEXT,
      defaultValue: "", // TEXT allows longer values
    },

    // User's last name
    lastName: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },

    // Gender field (free text)
    gender: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Employee internal identifier
    employee_id: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Country of origin or residence
    country: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Date of birth (stored as STRING — consider DATE in future)
    birthday: {
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

    // Visa type reference (slug-based relation)
    visa_type: {
      allowNull: false, // Required field
      type: Sequelize.STRING,
      defaultValue: "uncategorised",
      references: {
        model: "visa_types",
        key: "slug",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT", // Fallback value
    },

    // Job type reference (slug-based relation)
    job_type: {
      allowNull: false,
      type: Sequelize.STRING,
      defaultValue: "uncategorised",
      references: {
        model: "job_types",
        key: "slug",
      },
      onUpdate: "CASCADE",
      onDelete: "SET DEFAULT",
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
  await queryInterface.createTable("forms_previous_job", {
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
    name_of_employer: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Gender field (free STRING)
    address: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Employee internal identifier
    reason_for_leaving: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    from_date: {
      type: Sequelize.DATE,
    },
    to_date: {
      type: Sequelize.DATE,
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
  await queryInterface.createTable("forms_professional_membership", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    body_type: {
      type: Sequelize.STRING,
      defaultValue: "", // STRING allows longer values
    },

    // User's last name
    pin: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    renewal_date: {
      type: Sequelize.DATE,
    },

    // Gender field (free STRING)
    dbs_disclosure: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    issue_date: {
      type: Sequelize.DATE,
    },

    // Employee internal identifier
    clear: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    disclosure_number: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    certificate_registration: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    membership_card_upload: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    current_dbs_upload: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    dbs_update_check: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },

    // Country of origin or residence
    expiry_date: {
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
  await queryInterface.createTable("forms_rehabilitation", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    conviction: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    disciplinary_action: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    criminal_charges: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    consent: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    police_check: {
      type: Sequelize.STRING,
      defaultValue: "",
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
  await queryInterface.createTable("forms_resume", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    resume: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
    },
    date_of_birth_certificate: {
      type: Sequelize.TEXT,
      defaultValue: "[]", // STRING allows longer values
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
  await queryInterface.createTable("forms_right_to_work", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User's first name
    entitlement: {
      type: Sequelize.STRING,
      defaultValue: "uncategorised", // STRING allows longer values
    },

    // User's last name
    passport_number: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Gender field (free STRING)
    expiry_date: {
      type: Sequelize.DATE,
    },
    share_code: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Country of origin or residence
    passport_proof: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    brp_proof: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
    },
    right_to_work_update_check: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
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
  await queryInterface.createTable("forms_working_time", {
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
  await queryInterface.createTable("forms_address", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User title (Mr, Mrs, Dr, etc.)
    house_number: {
      type: Sequelize.STRING,
      // VARCHAR column
    },

    // User's first name
    address: {
      type: Sequelize.TEXT,
      defaultValue: "", // TEXT allows longer values
    },

    // User's last name
    city: {
      type: Sequelize.TEXT,
      defaultValue: "",
    },

    // Gender field (free text)
    state: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Employee internal identifier
    postal_code: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Country of origin or residence
    country: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    // Date of birth (stored as STRING — consider DATE in future)
    from_date: {
      type: Sequelize.DATE,
    },
    to_date: {
      type: Sequelize.DATE,
    },
    proof_of_address: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
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
  await queryInterface.createTable("forms_bank_details", {
    id: {
      allowNull: false, // Cannot be NULL
      primaryKey: true, // Primary key
      type: Sequelize.INTEGER.UNSIGNED, // Positive integer only
      autoIncrement: true, // Auto-increment value
    },

    // User title (Mr, Mrs, Dr, etc.)
    name_of_bank: {
      type: Sequelize.STRING,
      // VARCHAR column
    },

    // User's first name
    account_name: {
      type: Sequelize.STRING,
      defaultValue: "", // TEXT allows longer values
    },

    // User's last name
    account_type: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Gender field (free text)
    address: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Employee internal identifier
    postal_code: {
      type: Sequelize.STRING,
      defaultValue: "",
    },

    // Country of origin or residence
    account_no: {
      type: Sequelize.STRING,
      defaultValue: "",
    },
    sort_code: {
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
  await queryInterface.createTable("forms_confidentility", {
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
  });
}
export async function down(queryInterface, Sequelize) {
  /**
   * Add reverting commands here.
   *
   * Example:
   */
  await queryInterface.dropTable("forms_driving_details");
  await queryInterface.dropTable("forms_educational_qualification");
  await queryInterface.dropTable("forms_emergency_contact");
  await queryInterface.dropTable("forms_health_safety");
  await queryInterface.dropTable("forms_health_declaration");
  await queryInterface.dropTable("forms_immunisation");
  await queryInterface.dropTable("forms_passports");
  await queryInterface.dropTable("forms_personal_declaration");
  await queryInterface.dropTable("forms_personal_info");
  await queryInterface.dropTable("forms_previous_job");
  await queryInterface.dropTable("forms_professional_membership");
  await queryInterface.dropTable("forms_rehabilitation");
  await queryInterface.dropTable("forms_resume");
  await queryInterface.dropTable("forms_right_to_work");
  await queryInterface.dropTable("forms_working_time");
  await queryInterface.dropTable("forms_address");
  await queryInterface.dropTable("forms_bank_details");
  await queryInterface.dropTable("forms_confidentility");
}
