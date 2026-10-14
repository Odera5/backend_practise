import express from "express";
import { fileURLToPath } from "url";
import path from "path";

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || "production";
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// middleware
// serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));
// Set EJS as the templating engine
app.set("view engine", "ejs");
//Tell express where to find our template
app.set("views", path.join(__dirname, "src/views"));
// route
app.get("/", (req, res) => {
  const title = "Home";
  res.render("home", { title });
});
app.get("/organizations", (req, res) => {
  const title = "Organizations";
  res.render("organizations", { title });
});
app.get("/projects", (req, res) => {
  const title = "projects";
  res.render("projects", { title });
});
app.get("/categories", (req, res) => {
  const title = "Categories";
  res.render("categories", { title });
});
// express listening for http request
app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});
