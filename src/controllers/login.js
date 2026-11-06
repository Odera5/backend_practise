import bcrypt from "bcrypt";
import { authenticateUser } from "../models/users.js";
const showLoginForm = (req, res) => {
  const title = "Login account";
  const logoutSuccess = req.query.logout;
  res.render("login", { title, logoutSuccess });
};

const loginUser = async (req, res, next) => {
  const { password, email } = req.body;

  const result = await authenticateUser(email, password);
  if (!result.success) {
    req.flash("error", result.message);
    return res.redirect("/login");
  }
  req.session.user = result.user;
  req.flash("success", result.message);

  res.redirect(`/dashboard/${result.user.user_id}`);
};
const requireRole = (role) => {
  // Check if user is logged in first
  return (req, res, next) => {
    if (!req.session || !req.session.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }
    // Check if user's role matches the required role
    if (req.session.user.role_name !== role) {
      req.flash("error", "You do not have permission to access this page.");
      return res.redirect("/");
    }

    // User has required role, continue

    next();
  };
};
export { showLoginForm, loginUser, requireRole };
