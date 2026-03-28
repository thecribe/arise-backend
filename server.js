// import { sequelize } from "./config/database.js";

import app from "./app.js";
import db, { initDb, monitorDbConnection } from "./models/index.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDb();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    monitorDbConnection();
  } catch (error) {
    console.error("DB error:", error);
    throw error;
  }
})();
