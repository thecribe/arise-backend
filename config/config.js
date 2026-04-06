import mysql2 from "mysql2";
// import dotenv from "dotenv";

// dotenv.config({ path: ".env" });

const config = {
  development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "recruitment",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectModule: mysql2,
    pool: {
      max: 5, // Keep this LOW on shared hosting (3–8 is safe)
      min: 0,
      acquire: 30000, // Max time to wait for a connection
      idle: 10000, // Close idle connections after 10 seconds
    },

    logging: false,
  },

  test: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME_TEST || "recruitment",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
  },

  production: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "recruitment",
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    dialectModule: mysql2,
    pool: {
      max: 5, // Keep this LOW on shared hosting (3–8 is safe)
      min: 0,
      acquire: 30000, // Max time to wait for a connection
      idle: 10000, // Close idle connections after 10 seconds
    },

    logging: false,
  },
};

export default config;
