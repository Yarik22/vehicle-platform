import { query } from "../db.js";

export async function createVehicle({ make, model, year, user_id }) {
  const result = await query(
    `INSERT INTO vehicles (make, model, year, user_id) 
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [make, model, year, user_id]
  );
  return result.rows[0];
}

export async function getAllVehicles() {
  const result = await query("SELECT * FROM vehicles ORDER BY id");
  return result.rows;
}

export async function getVehicleById(id) {
  const result = await query("SELECT * FROM vehicles WHERE id = $1", [id]);
  return result.rows[0];
}

export async function updateVehicle(id, { make, model, year, user_id }) {
  const result = await query(
    `UPDATE vehicles SET make = $1, model = $2, year = $3, user_id = $4
     WHERE id = $5 RETURNING *`,
    [make, model, year, user_id, id]
  );
  return result.rows[0];
}

export async function deleteVehicle(id) {
  const result = await query("DELETE FROM vehicles WHERE id = $1 RETURNING *", [
    id,
  ]);
  return result.rows[0];
}
