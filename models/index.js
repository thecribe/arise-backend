import fs from "fs";
import path from "path";
import Sequelize from "sequelize";

import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || "development";

import configFile from "../config/config.js";
const config = configFile[env];

const db = {};
let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config, // spread original config
    pool: {
      max: 5, // Keep this LOW on shared hosting
      min: 0,
      acquire: 30000, // Max 30s to acquire connection
      idle: 10000, // Close idle connections after 10s
    },
    logging: false, // Set to true only when debugging
  });
}

/**
 * Initialize models explicitly
 */
export const initDb = async (retries = 5, delay = 5000) => {
  const files = fs
    .readdirSync(__dirname)
    .filter(
      (file) =>
        file !== basename && file.endsWith(".js") && !file.endsWith(".test.js"),
    );

  for (const file of files) {
    const fileUrl = pathToFileURL(path.join(__dirname, file)).href;
    const { default: modelDef } = await import(fileUrl);

    const model = modelDef(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  }

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  // Retry logic for database connection
  while (retries > 0) {
    try {
      console.log("Attempting DB connection...");
      await sequelize.authenticate();

      // await sequelize.sync({ alter: true }); // Sync models to DB (use with caution in production)
      console.log("✅ Database connected successfully");
      return db; // Return db object for convenience
    } catch (error) {
      console.error("❌ DB connection failed:", error.message);
      retries -= 1;

      if (retries === 0) {
        console.error("No more retries left. Giving up.");
        throw error;
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

export const monitorDbConnection = () => {
  setInterval(async () => {
    try {
      await sequelize.authenticate();
      console.log(" DB still connected");
    } catch (error) {
      console.error(" Lost DB connection:", error.message);
    }
  }, 30000); // check every 30 seconds
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

/**
 * Graceful Shutdown - VERY IMPORTANT for cPanel / Passenger
 */
const gracefulShutdown = async () => {
  console.log("🛑 Closing database connection pool...");
  try {
    await sequelize.close();
    console.log("✅ Database connection closed successfully");
  } catch (err) {
    console.error("Error while closing database:", err.message);
  }
  process.exit(0);
};

// Listen for shutdown signals from cPanel / Phusion Passenger
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("beforeExit", gracefulShutdown);

export default db;
