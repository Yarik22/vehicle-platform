import {
  createUser as _createUser,
  getAllUsers as _getAllUsers,
  getUserById as _getUserById,
  updateUser as _updateUser,
  deleteUser as _deleteUser,
} from "../models/userModel.js";

import { publishUserCreated } from "../rabbit/rabbit.js";

export async function createUser(req, res) {
  try {
    const { email, name, password } = req.body;
    if (!password) {
      return res.status(400).json({ error: "Пароль обязателен" });
    }

    const user = await _createUser(email, name, password);
    publishUserCreated(user);
    res.status(201).json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getAllUsers(req, res) {
  try {
    const users = await _getAllUsers();
    res.json(users);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await _getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
}

export async function updateUser(req, res) {
  try {
    const { email, name, password } = req.body;

    // Передаем пароль в базу как есть, триггер его захеширует при необходимости
    const user = await _updateUser(req.params.id, email, name, password);

    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
}

export async function deleteUser(req, res) {
  try {
    const user = await _deleteUser(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Database error" });
  }
}
