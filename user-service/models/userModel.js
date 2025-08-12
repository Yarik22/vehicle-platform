import { query } from "../db.js";

export async function createUser(email, name, passwordHash) {
  const result = await query(
    `INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3)
     RETURNING id, email, name`,
    [email, name, passwordHash]
  );
  return result.rows[0];
}

export async function getAllUsers() {
  const result = await query("SELECT * FROM users ORDER BY id");
  return result.rows;
}

export async function getUserById(id) {
  const result = await query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateUser(id, email, name, passwordHash) {
  if (passwordHash) {
    const result = await query(
      `UPDATE users SET email = $1, name = $2, password_hash = $3 WHERE id = $4 RETURNING *`,
      [email, name, passwordHash, id]
    );
    return result.rows[0];
  } else {
    const result = await query(
      `UPDATE users SET email = $1, name = $2 WHERE id = $3 RETURNING *`,
      [email, name, id]
    );
    return result.rows[0];
  }
}

export async function deleteUser(id) {
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
}
