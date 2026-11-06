import { getRegisteredUsers } from "../models/registeredUser.js";
const displayRegisteredUser = async (req, res) => {
  const title = "Registered Users";
  const registeredUsers = await getRegisteredUsers(); // Fetch registered users from the database
  res.render("registered-users", { title, registeredUsers });
};
export { displayRegisteredUser };
