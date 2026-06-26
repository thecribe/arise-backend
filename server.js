// import { sequelize } from "./config/database.js";

import app from "./app.js";
import db, { initDb, monitorDbConnection } from "./models/index.js";
import "./api/recruitment/v1/utils/consoleLogger.js";

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await initDb();
    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    setInterval(() => {
      server.getConnections((err, count) => {
        console.log("HTTP Connections:", count);
      });
    }, 5000);
    // monitorDbConnection();
  } catch (error) {
    console.error("DB error:", error);
    process.exit(1);
  }
})();
