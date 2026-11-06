import bcrypt from "bcrypt";
import { createNewUser } from "../models/users.js";

const showUserRegistrationForm = (req, res) => {
  const title = "Create an Account";
  res.render("register", { title });
};

const processNewRegistrationForm = async (req, res, next) => {
  try {
    const saltRound = 10;

    const { name, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, saltRound);
    await createNewUser(name, email, hashPassword);
    console.log("User register succcessfully");
    res.redirect("login");
  } catch (error) {
    next(error);
  }
};
const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};
export { showUserRegistrationForm, processNewRegistrationForm, requireLogin };
