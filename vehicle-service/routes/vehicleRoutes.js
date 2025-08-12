import express from "express";
import * as VehicleController from "../controllers/vehicleController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/vehicles", authenticateToken, VehicleController.createVehicle);
router.get("/vehicles", VehicleController.getAllVehicles);
router.get("/vehicles/:id", VehicleController.getVehicleById);
router.put("/vehicles/:id", authenticateToken, VehicleController.updateVehicle);
router.delete(
  "/vehicles/:id",
  authenticateToken,
  VehicleController.deleteVehicle
);

export default router;
