import { getAllCategories } from "../models/categories.js";

const getCategories = async (req, res) => {
  const title = "Categories";
  try {
    const categories = await getAllCategories();
    res.render("categories", { title, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error; // Let the global error handler handle this
  }
};
export { getCategories };
