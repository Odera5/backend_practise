import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DB_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

const db = {
  async query(text, params) {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.ENABLE_SQL_LOGGING === "true"
    ) {
      try {
        const start = Date.now();
        const result = await pool.query(text, params);
        const duration = Date.now() - start;

        console.log("Executed query:", {
          text: text.replace(/\s+/g, " ").trim(),
          duration: `${duration}ms`,
          rows: result.rowCount,
        });

        return result;
      } catch (error) {
        console.error("Error executing query:", {
          text: text.replace(/\s+/g, " ").trim(),
          error: error.message,
        });

        throw error;
      }
    }

    return pool.query(text, params);
  },
};

const testConnection = async () => {
  try {
    const result = await db.query("SELECT NOW() AS current_time");

    console.log(
      "Database connection successful. Current time:",
      result.rows[0].current_time,
    );
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};

export { pool, testConnection };
export default db;
