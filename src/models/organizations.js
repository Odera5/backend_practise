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
  SELECT organization_id,name, description, email, logo_filename
   FROM organizations
   WHERE  organization_id = $1;
  `;
  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);
  return result.rows[0] || null;
};
// create a new organisation function

const createNewOrganization = async (
  name,
  description,
  email,
  logo_filename,
) => {
  const query = `
  INSERT INTO organizations 
  (name, description, email, logo_filename)
  VALUES
  ($1, $2, $3, $4)
  RETURNING organization_id;
  `;
  const queryParams = [name, description, email, logo_filename];
  const result = await db.query(query, queryParams);

  if (result.rowCount == 0) {
    throw new Error("failed to create new organisation");
  }
  if (process.env.ENABLE_SQL_LOGGING == "true") {
    console.log(
      "Created new organization with ID:",
      result.rows[0].organization_id,
    );
  }

  return result.rows[0].organization_id || null;
};
const updateOrganization = async (
  organizationId,
  name,
  description,
  contactEmail,
) => {
  const query = `
UPDATE organizations
set name = $2, description = $3, email = $4
WHERE organization_id = $1
RETURNING organization_id`;

  const queryParams = [organizationId, name, description, contactEmail];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Organization not found");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated organization with ID:", organizationId);
  }

  return result.rows[0].organization_id;
};

export {
  getAllOrganizations,
  getOrganizationDetails,
  createNewOrganization,
  updateOrganization,
};
