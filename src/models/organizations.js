import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `SELECT organization_id, name, description, email, logo_filename
   FROM organizations`;
  const result = await db.query(query);
  console.log("Fetched organizations from database:", result.rows);
  return result.rows;
};

export { getAllOrganizations };
