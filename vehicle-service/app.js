import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import { connectRabbit } from "./rabbit/rabbit.js";

dotenv.config();

const app = express();
const PORT = process.env.VEHICLE_SERVICE_PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use(vehicleRoutes);

async function start() {
  try {
    await connectRabbit();
    app.listen(PORT, () => {
      console.log(`Vehicle Service listening on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start Vehicle Service", e);
  }
}

start();
