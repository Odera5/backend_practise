import db from "./db.js";

// function to get all service projects
const getAllProjects = async () => {
  const query = `
    SELECT sp.project_id, sp.title, sp.description, sp.date, sp.location, o.name, sp.organization_id
    FROM service_project sp
    JOIN organizations o 
    ON sp.organization_id = o.organization_id;`;

  const result = await db.query(query);
  return result.rows;
};

// function to get service project belonging to a specific organization
const getProjectsByOrganization = async (organizationId) => {
  const query = `
  SELECT sp.project_id, sp.title, sp.description, sp.date, sp.location, sp.organization_id
  FROM service_project sp
  WHERE sp.organization_id = $1;  `;
  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);
  return result.rows || null;
};

// function to get upcoming projects
const getUpcomingProjects = async (number_of_projects) => {
  const query = `
   SELECT sp.project_id, sp.title, sp.description, sp.date, sp.location, o.name, sp.organization_id
    FROM service_project sp
    JOIN organizations o 
    ON sp.organization_id = o.organization_id
    WHERE sp.date > CURRENT_DATE
    ORDER BY sp.date ASC
    
    LIMIT $1;
  `;
  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);
  return result.rows || null;
};
// function to get service project details
const getProjectDetails = async (id) => {
  const query = `
 SELECT sp.project_id, sp.title, sp.description, sp.date, sp.location, o.name, sp.organization_id
    FROM service_project sp
    JOIN organizations o 
    ON sp.organization_id = o.organization_id
    WHERE sp.project_id = $1 ;
`;
  const queryParams = [id];
  console.log(`project id: ${id}`);
  const result = await db.query(query, queryParams);
  return result.rows[0] || null;
};
// function to get all category for a given service project
const getServiceProjectForCategory = async (categoryId) => {
  const query = `
  SELECT sp.project_id, sp.title
  FROM service_project sp
  JOIN project_category cp
  ON sp.project_id = cp.project_id
  JOIN category c
  ON cp.category_id =  c.category_id
  WHERE  c.category_id = $1;

  `;
  const queryParams = [categoryId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

const createNewProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
      INSERT INTO service_project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    console.error("Failed to Create New Project");
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  title,
  description,
  location,
  date,
  organization_id,
  project_id,
) => {
  const query = `
  UPDATE service_project
  SET title = $1, description = $2, location = $3, date = $4, organization_id = $5
  WHERE project_id = $6
  RETURNING project_id;
`;
  const queryParams = [
    title,
    description,
    location,
    date,
    organization_id,
    project_id,
  ];
  const result = await db.query(query, queryParams);
  if ((await result).rows.length === 0) {
    throw new Error("Failed to update Service project");
  }
  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(
      "Service project updated successfuly. projectId:",
      result.rows[0].project_id,
    );
  }
  return result.rows[0].project_id;
};

export {
  getAllProjects,
  getProjectsByOrganization,
  getUpcomingProjects,
  getProjectDetails,
  getServiceProjectForCategory,
  createNewProject,
  updateProject,
};
