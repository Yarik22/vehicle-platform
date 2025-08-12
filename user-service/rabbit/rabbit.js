import { connect } from "amqplib";
import dotenv from "dotenv";
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
      console.log("Connected to RabbitMQ");

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

export function publishUserCreated(user) {
  if (!channel) {
    console.error("No RabbitMQ channel");
    return;
  }
  const event = {
    type: "USER_CREATED",
    data: {
      id: user.id,
      email: user.email,
    },
  };
  channel.publish("user_events", "", Buffer.from(JSON.stringify(event)));
  console.log("Published USER_CREATED event", event);
}
