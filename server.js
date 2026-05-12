import app from "./app.js";
import db, { initDb, monitorDbConnection } from "./models/index.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDb();

    console.log("DB connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // monitorDbConnection();
  } catch (error) {
    console.error("DB error:", error);
    process.exit(1);
  }
}

startServer();
