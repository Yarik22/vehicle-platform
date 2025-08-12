import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { connectRabbit } from "./rabbit/rabbit.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.USER_SERVICE_PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

app.use(userRoutes);

async function start() {
  try {
    await connectRabbit();
    app.listen(PORT, () => {
      console.log(`User Service listening on port ${PORT}`);
    });
  } catch (e) {
    console.error("Failed to start app", e);
  }
}

start();
