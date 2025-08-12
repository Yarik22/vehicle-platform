import { connect } from "amqplib";
import dotenv from "dotenv";
import * as Vehicle from "../models/vehicleModel.js";

dotenv.config();

let channel;

export async function connectRabbit() {
  const maxRetries = 5;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const connection = await connect(process.env.RABBIT_URL);
      channel = await connection.createChannel();
      await channel.assertExchange("user_events", "fanout", { durable: true });

      const q = await channel.assertQueue("", { exclusive: true });
      await channel.bindQueue(q.queue, "user_events", "");

      channel.consume(
        q.queue,
        async (msg) => {
          if (msg?.content) {
            const event = JSON.parse(msg.content.toString());

            if (event.type === "USER_CREATED") {
              const userId = event.data.id;
              try {
                await Vehicle.createVehicle({
                  make: "Unknown",
                  model: "Unknown",
                  year: null,
                  user_id: userId,
                });
                console.log(`Created default vehicle for user ${userId}`);
              } catch (err) {
                console.error("Failed to create default vehicle:", err);
              }
            }
          }
        },
        { noAck: true }
      );

      console.log(
        "Connected to RabbitMQ and listening for USER_CREATED events"
      );

      connection.on("close", () => {
        console.error("RabbitMQ connection closed");
        channel = null;
      });

      connection.on("error", (err) => {
        console.error("RabbitMQ connection error:", err);
      });

      return;
    } catch (error) {
      attempt++;
      console.error(
        `RabbitMQ connection attempt ${attempt} failed:`,
        error.message
      );
      if (attempt >= maxRetries) {
        throw new Error("Failed to connect to RabbitMQ after 5 attempts");
      }
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
}

export function publishVehicleEvent(event) {
  if (!channel) {
    console.error("No RabbitMQ channel");
    return;
  }
  channel.publish("vehicle_events", "", Buffer.from(JSON.stringify(event)));
  console.log("Published vehicle event", event);
}
