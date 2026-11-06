import {
  getAllCategories,
  getCategoryDetails,
  createNewCategory,
  updateCategory,
} from "../models/categories.js";
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

const showNewCategoryForm = (req, res) => {
  const title = "Add new category";
  res.render("new-category", { title });
};
const processNewCategory = async (req, res, next) => {
  const { name } = req.body;
  const categoryId = await createNewCategory(name);
  req.flash("success", "Category created successfully");
  res.redirect(`/category/${categoryId}`);
};
// const showUpdateCategoryPage = (req, res) => {
//   const title = "Edit category";
//   res.render("edit-category", { title });
// };

const showEditCategoryPage = async (req, res, next) => {
  const categoryId = req.params.category_id;
  const title = "Edit category";
  const category = await getCategoryDetails(categoryId);
  console.log("category id: ", category);
  res.render("edit-category", { title, category });
};
const processEditCategory = async (req, res, next) => {
  const categoryId = req.params.category_id;
  const { title } = req.body;
  await updateCategory(title, categoryId);
  res.redirect(`/category/${categoryId}`);
};
export {
  getCategories,
  showCategory,
  showNewCategoryForm,
  processNewCategory,
  showEditCategoryPage,
  processEditCategory,
};
