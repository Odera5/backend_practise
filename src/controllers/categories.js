import { getAllCategories, getCategoryDetails } from "../models/categories.js";
import { getServiceProjectForCategory } from "../models/projects.js";
// controller function to get all categories
const getCategories = async (req, res, next) => {
  const title = "Categories";
  try {
    const categories = await getAllCategories();
    res.render("categories", { title, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    next(error); // Let the global error handler handle this
  }
};

//controller function to get category details
const showCategory = async (req, res, next) => {
  const categoryId = req.params.category_id;
  console.log("category id", categoryId);
  let title;
  try {
    const categoryDetails = await getCategoryDetails(categoryId);
    title = categoryDetails.name;
    const serviceProject = await getServiceProjectForCategory(categoryId);
    res.render("category", { title, categoryDetails, serviceProject });
  } catch (error) {
    const err = new Error(`Error fetching category details: ${error.message}`);
    next(err);
  }
};
export { getCategories, showCategory };
