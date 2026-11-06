import { getUserDetail } from "../models/users.js";
const showDashboard = async (req, res) => {
  const userId = req.params.user_id;
  const title = "Dashboard";
  console.log("userId", userId);

  const userName = await getUserDetail(userId);
  const user = {
    role_name: userName.role_name,
    name: userName.name,
    email: userName.email,
  };
  res.render("dashboard", {
    title,
    user,
  });
};
export { showDashboard };
