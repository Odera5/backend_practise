import {
  getAllOrganizations,
  getOrganizationDetails,
} from "../models/organizations.js";
import { getProjectsByOrganization } from "../models/projects.js";
// controller function to get all organizations
const getOrganizations = async (req, res, next) => {
  const title = "Organizations";
  console.log("getOrganizations controller reached");
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title, organizations });
    console.log("Fetched organizations:", organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
    next(error); // Let the global error handler handle this
  }
};

// controller function to get organization detail
const getOrganizationDetailsController = async (req, res, next) => {
  const organizationId = req.params.organizationId;
  let title;
  try {
    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganization(organizationId);
    title = organizationDetails.name;
    res.render("organization", {
      title,
      organizationDetails,
      projects,
    });
  } catch (error) {
    console.error("Error fetching organization details:", error.message);
    next(error);
  }
};

export { getOrganizations, getOrganizationDetailsController };
