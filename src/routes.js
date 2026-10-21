import express from "express";
import {
  getOrganizations,
  getOrganizationDetailsController,
} from "./controllers/organizations.js";
import { getProjects, showProjectDetails } from "./controllers/projects.js";
import { getCategories, showCategory } from "./controllers/categories.js";
import { getHome } from "./controllers/home.js";

const router = express.Router();
router.get("/organizations", getOrganizations);
router.get("/projects", getProjects);
router.get("/categories", getCategories);
router.get("/", getHome);
router.get("/organization/:organizationId", getOrganizationDetailsController);
router.get("/project/:project_id", showProjectDetails);
router.get("/category/:category_id", showCategory);
export { router };
