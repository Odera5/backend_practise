import db from "./db.js";

// function to get all categories
const getAllCategories = async () => {
  const query = `
    SELECT category_id, name
    FROM category;`;
  const result = await db.query(query);
  return result.rows;
};

//function to get category details
const getCategoryDetails = async (id) => {
  const query = `
SELECT category_id, name
FROM category
WHERE category_id = $1 ;
`;
  const queryParams = [id];
  const result = await db.query(query, queryParams);
  return result.rows[0] || null;
};

// function to get all category for a given service project
const getCategoryForServiceProject = async (projectId) => {
  const query = `
  SELECT c.name, c.category_id
  FROM category c
  JOIN project_category cp
  ON c.category_id = cp.category_id
  JOIN service_project sp
  ON cp.project_id =  sp.project_id
  WHERE  sp.project_id = $1;

  `;
  const queryParams = [projectId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

const createNewCategory = async (name) => {
  const query = `
  INSERT INTO category (name)
  VALUES($1)
  RETURNING category_id;
  `;
  const queryParams = [name];
  const result = await db.query(query, queryParams);
  if (result.rows[0] === 0) {
    throw new Error("Failed to create New categories");
  }
  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("New category created successfully");
  }
  return result.rows[0].category_id;
};

const updateCategory = async (name, categoryId) => {
  const query = `
UPDATE category
SET name = $1
WHERE category_id = $2
RETURNING category_id;
`;
  const queryParams = [name, categoryId];
  const result = await db.query(query, queryParams);
  if (result.rows[0] == 0) {
    throw new Error("Failed to update category");
  }
  if (process.env.ENABLE_SQL_LOGGING == "true") {
    console.log("Category updated sucessfully");
  }
  return result.rows[0];
};
export {
  getAllCategories,
  getCategoryDetails,
  getCategoryForServiceProject,
  createNewCategory,
  updateCategory,
};
