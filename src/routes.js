import express from "express";
import {
  getOrganizations,
  getOrganizationDetailsController,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";
import {
  getProjects,
  showProjectDetails,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProject,
} from "./controllers/projects.js";
import {
  getCategories,
  showCategory,
  showNewCategoryForm,
  processNewCategory,
  showEditCategoryPage,
  processEditCategory,
} from "./controllers/categories.js";
import { getHome } from "./controllers/home.js";
import {
  showUserRegistrationForm,
  processNewRegistrationForm,
} from "./controllers/users.js";
import { showDashboard } from "./controllers/dashboard.js";
import { showLoginForm, loginUser, requireRole } from "./controllers/login.js";
import { processLogout } from "./controllers/logout.js";
import { requireLogin } from "./controllers/users.js";
import { displayRegisteredUser } from "./controllers/registeredUser.js";

const router = express.Router();
router.get("/organizations", getOrganizations);
router.get("/projects", getProjects);
router.get("/categories", getCategories);
router.get("/", getHome);

router.get("/organization/:organizationId", getOrganizationDetailsController);
router.get("/project/:project_id", showProjectDetails);
router.get("/category/:category_id", showCategory);
// Route for new organization page
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
// Route to handle new organization form submission
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);
// Route for new project page
router.get("/new-project", requireRole("admin"), showNewProjectForm);
// Route to handle new project form submission
router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);
router.get(
  "/edit-project/:project_id",
  requireRole("admin"),
  showEditProjectForm,
);
router.post(
  "/edit-project/:project_id",
  requireRole("admin"),
  projectValidation,
  processEditProject,
);
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post("/new-category", requireRole("admin"), processNewCategory);
router.get(
  "/edit-category/:category_id",
  requireRole("admin"),
  showEditCategoryPage,
);
router.post(
  "/edit-category/:category_id",
  requireRole("admin"),
  processEditCategory,
);
router.get("/register", showUserRegistrationForm);
router.post("/register", processNewRegistrationForm);
router.get("/dashboard/:user_id", requireLogin, showDashboard);
router.get("/login", showLoginForm);
router.post("/login", loginUser);
router.get("/logout", processLogout);
router.get("/registered-users", requireRole("admin"), displayRegisteredUser);

export { router };
