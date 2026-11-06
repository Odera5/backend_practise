import {
  getAllOrganizations,
  getOrganizationDetails,
  createNewOrganization,
  updateOrganization,
} from "../models/organizations.js";
import { getProjectsByOrganization } from "../models/projects.js";
import { body, validationResult } from "express-validator";

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

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
const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";

  res.render("new-organization", { title });
};

const processNewOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new organization form
    return res.redirect("/new-organization");
  }

  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createNewOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  // Set a success flash message
  req.flash("success", "Organization added successfully!");
  res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
  const title = "Edit Organization";
  const organizationId = req.params.id;
  const organization = await getOrganizationDetails(organizationId);
  res.render("edit-organization", { title, organization });
};
const processEditOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the edit organization form
    return res.redirect("/edit-organization/" + req.params.id);
  }

  const { name, description, contactEmail } = req.body;
  const organizationId = req.params.id;
  await updateOrganization(organizationId, name, description, contactEmail);
  // Set a success flash message
  req.flash("success", "Organization updated successfully!");

  res.redirect(`/organization/${organizationId}`);
};

export {
  getOrganizations,
  getOrganizationDetailsController,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
};
