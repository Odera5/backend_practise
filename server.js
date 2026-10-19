import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import { testConnection } from "./src/models/db.js";
import { getOrganizations } from "./src/controllers/organizations.js";
import { getProjects } from "./src/controllers/projects.js";
import { getCategories } from "./src/controllers/categories.js";
import helmet from "helmet";
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(helmet());

// middleware
// serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));
// Set EJS as the templating engine
app.set("view engine", "ejs");
//Tell express where to find our template
app.set("views", path.join(__dirname, "src/views"));
//log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
// make node_env available in templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});
// route
app.get("/", (req, res) => {
  const title = "Home";
  res.render("home", { title });
});
app.get("/organizations", getOrganizations);
app.get("/projects", getProjects);
app.get("/categories", getCategories);

// catch-call error handling middleware
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

//global errorhandling middleware
app.use((err, req, res, next) => {
  const title = "Error";
  const status = err.status || 500;
  const stack = err.stack || "";
  const message = err.message || "Internal Server Error";
  res
    .status(status)
    .render(`errors/${status}`, { title, message, stack, status });
});
// express listening for http request
app.listen(PORT, async () => {
  await testConnection();
  console.log(`server is running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
