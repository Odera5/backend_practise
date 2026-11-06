import {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
} from "../models/projects.js";
import { getCategoryForServiceProject } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { createNewProject, updateProject } from "../models/projects.js";
import { body, validationResult } from "express-validator";

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("title required")
    .isLength({ max: 150 })
    .withMessage("title can not exceed 150"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("description required")
    .isLength({ max: 500 })
    .withMessage("project description can not exceed 500"),
  body("location").trim().notEmpty().withMessage("Location required"),
  body("date")
    .notEmpty()
    .withMessage("date is required")
    .isDate()
    .withMessage("Enter a valid date"),
  body("organization_id")
    .notEmpty()
    .withMessage("Select an organization")
    .isInt({ min: 1 })
    .withMessage("Please select a valid organization"),
];

// controller function to get all projects
const getProjects = async (req, res, next) => {
  const title = "Projects";
  const number_of_upcomig = 5;
  try {
    const projects = await getUpcomingProjects(number_of_upcomig);
    res.render("projects", { title, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    next(error); // Let the global error handler handle this
  }
};

//controller function to get project details

const showProjectDetails = async (req, res, next) => {
  let title;
  const projectId = req.params.project_id;
  try {
    const projectDetails = await getProjectDetails(projectId);
    const categories = await getCategoryForServiceProject(projectId);

    title = projectDetails.title;
    res.render("project", { title, projectDetails, categories });
  } catch (error) {
    const message = error.message;
    const err = new Error(`Could not fetch project detail: ${message}`);
    next(err);
  }
};
const showNewProjectForm = async (req, res, next) => {
  try {
    const projectOrganizatons = await getAllOrganizations();
    const title = "Add New Service Project";

    res.render("new-project", { title, projectOrganizatons });
  } catch (error) {
    const err = `Failed to get all organizarion for new project: ${error.mesaageg}`;
    next(err);
  }
};

const processNewProjectForm = async (req, res) => {
  // Extrat form data from req.body
  const result = validationResult(req);
  if (!result.isEmpty()) {
    result.array().forEach((err) => {
      req.flash("error", err.message);
    });
    return res.redirect("/new-project");
  }
  const { title, description, location, date, organization_id } = req.body;
  const newProjectId = await createNewProject(
    title,
    description,
    location,
    date,
    organization_id,
  );
  req.flash("success", "New service project created sucessfully");
  res.redirect(`/project/${newProjectId}`);
};

const showEditProjectForm = async (req, res, next) => {
  try {
    const title = "Edit Service project";
    const projectId = req.params.project_id;
    const Project = await getProjectDetails(projectId);
    const projectOrganizations = await getAllOrganizations();
    console.log(Project.description);
    res.render("edit-project", { title, Project, projectOrganizations });
  } catch (error) {
    const err = `Could not load edit project form: ${error.message}`;
    console.error(err);
    next(err);
  }
};
const processEditProject = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty) {
    result.array().forEach((err) => {
      req.flash("error", err.message);
    });
    return res.redirect(`/edit-project/${req.params.project_id}`);
  }
  try {
    const projectId = req.params.project_id;
    const { title, description, location, date, organization_id } = req.body;
    await updateProject(
      title,
      description,
      location,
      date,
      organization_id,
      projectId,
    );
    req.flash("success", "Project updated successfully");
    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};
export {
  getProjects,
  showProjectDetails,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  processEditProject,
};
