import { getAllOrganizations } from "../models/organizations.js";

const getOrganizations = async (req, res) => {
  const title = "Organizations";
  console.log("getOrganizations controller reached");
  try {
    const organizations = await getAllOrganizations();
    res.render("organizations", { title, organizations });
    console.log("Fetched organizations:", organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error.message);
    res
      .status(500)
      .render("error", { title, error: "Failed to fetch organizations" });
  }
};

export { getOrganizations };
