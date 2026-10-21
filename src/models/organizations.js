import db from "./db.js";

// function to get all organizations
const getAllOrganizations = async () => {
  const query = `SELECT organization_id, name, description, email, logo_filename
   FROM organizations`;
  const result = await db.query(query);
  console.log("Fetched organizations from database:", result.rows);
  return result.rows;
};

// function to get organization detail
const getOrganizationDetails = async (organizationId) => {
  const query = `
  SELECT name, description, email, logo_filename
   FROM organizations
   WHERE  organization_id = $1;
  `;
  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);
  return result.rows[0] || null;
};

export { getAllOrganizations, getOrganizationDetails };
