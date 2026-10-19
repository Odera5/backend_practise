import { getAllProjects } from "../models/projects.js";

const getProjects = async (req, res) => {
  const title = "Projects";
  const projects = await getAllProjects();
  res.render("projects", { title, projects });
};

export { getProjects };
