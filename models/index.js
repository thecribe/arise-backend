import fs from "fs";
import path from "path";
import Sequelize from "sequelize";
import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "url";

dotenv.config();

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
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
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

  while (retries > 0) {
    try {
      console.log("Attempting DB connection...");
      await sequelize.authenticate();
      console.log(" Database connected");

      return; // success → exit function
    } catch (error) {
      console.error(" DB connection failed:", error.message);

      retries -= 1;

      if (retries === 0) {
        console.error("No more retries left.");
        throw error; // 🔥 Important
      }

      console.log(`Retrying in ${delay / 1000} seconds...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  await sequelize.authenticate();
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

export default db;
