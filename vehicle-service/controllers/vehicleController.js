import * as Vehicle from "../models/vehicleModel.js";

export async function createVehicle(req, res) {
  try {
    const vehicle = await Vehicle.createVehicle(req.body);
    res.status(201).json(vehicle);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getAllVehicles(req, res) {
  try {
    const vehicles = await Vehicle.getAllVehicles();
    res.json(vehicles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getVehicleById(req, res) {
  try {
    const vehicle = await Vehicle.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function updateVehicle(req, res) {
  try {
    const vehicle = await Vehicle.updateVehicle(req.params.id, req.body);
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(vehicle);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function deleteVehicle(req, res) {
  try {
    await Vehicle.deleteVehicle(req.params.id);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
