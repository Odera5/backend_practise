import db from "./db.js";
const getRegisteredUsers = async () => {
  const query = `
SELECT name,email,role_name
FROM users
JOIN roles 
ON users.role_id = roles.role_id;
`;
  const registeredUsers = await db.query(query);
  console.log("Registered Users:", registeredUsers.rows);
  return registeredUsers.rows;
};
export { getRegisteredUsers };
