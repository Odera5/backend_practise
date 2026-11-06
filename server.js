import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { pool, testConnection } from "./src/models/db.js";
import connectPgSimple from "connect-pg-simple";
import { router } from "./src/routes.js";
import helmet from "helmet";
import session from "express-session";
import flash from "./src/middleware/flash.js";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PostgresStore = connectPgSimple(session);
const app = express();

if (NODE_ENV === "production") {
  app.set("trust proxy", 1);
}
// Security
app.use(helmet());

// Session management
app.use(
  session({
    store: new PostgresStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: "lax",
    },
  }),
);

// Flash messages
app.use(flash);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

// Request body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Make environment available in EJS
app.use((req, res, next) => {
  res.locals.isLoggedIn = false;
  if (req.session && req.session.user) {
    res.locals.isLoggedIn = true;
  }
  res.locals.user = req.session.user || null;
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

// Routes
app.use(router);

// 404 handler
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

// Global error handler
app.use((err, req, res, next) => {
  const title = "Error";
  const status = err.status || 500;
  const stack = err.stack || "";
  const message = err.message || "Internal Server Error";

  res.status(status).render(`errors/${status}`, {
    title,
    message,
    stack,
    status,
  });
});

// Start server
const startServer = async () => {
  try {
    await testConnection();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
      console.log(`Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exitCode = 1;
  }
};

startServer();
