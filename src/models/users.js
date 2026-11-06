import db from "./db.js";
import bcrypt from "bcrypt";
const createNewUser = async (name, email, password_hash) => {
  const default_role = "user";
  const query = `
    INSERT INTO users (name, email, password_hash, role_id)
    VALUES
    ($1,$2,$3,(SELECT role_id FROM roles WHERE role_name = $4 ))
    RETURNING user_id;
    `;
  const queryParams = [name, email, password_hash, default_role];
  const result = await db.query(query, queryParams);
  if (result.rows.length == 0) {
    throw new Error("Failed to create user");
  }
  if (process.env.ENABLE_SQL_LOGGING == "true") {
    console.log("User created successfully");
  }
  return result.rows[0].user_id;
};

const getUserDetail = async (userId) => {
  const query = `
    SELECT name, email, role_name
    FROM users JOIN roles ON users.role_id = roles.role_id
    WHERE user_id = $1;
    `;
  const queryParams = [userId];
  const result = await db.query(query, queryParams);
  return result.rows[0] || null;
};
const findUserByEmail = async (email) => {
  const query = `
    SELECT user_id, name,email,password_hash,role_name
    FROM users 
    JOIN roles ON users.role_id = roles.role_id
    WHERE email = $1;
    `;
  const queryParams = [email];
  const result = await db.query(query, queryParams);

  return result.rows[0] || null;
};

const verifyPassword = async (password, passwordHash) => {
  return bcrypt.compare(password, passwordHash);
};

const authenticateUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
  const isMatch = await verifyPassword(password, user.password_hash);
  console.log("isMatch", isMatch);
  if (!isMatch) {
    return {
      success: false,
      message: "Invalid email or password",
    };
  }
  user.password_hash = "";
  return { success: true, user, message: "Login successful" };
};
export { createNewUser, getUserDetail, authenticateUser };
