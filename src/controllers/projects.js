import {
  getAllProjects,
  getUpcomingProjects,
  getProjectDetails,
} from "../models/projects.js";
import { getCategoryForServiceProject } from "../models/categories.js";

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

export { getProjects, showProjectDetails };
