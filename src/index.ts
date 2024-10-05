import mongoose from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";
const socket = require("socket.io");
import { Socket } from "socket.io";
dotenv.config();

const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined in .env");
    }
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined in .env");
    }
    if (!process.env.TWITTER_API_KEY) {
      throw new Error("TWITTER_API_KEY must be defined in .env");
    }
    if (!process.env.TWITTER_API_SECRET) {
      throw new Error("TWITTER_API_SECRET must be defined in .env");
    }
    if (!process.env.ACCESS_TOKEN) {
      throw new Error("ACCESS_TOKEN must be defined in .env");
    }
    if (!process.env.ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET must be defined in .env");
    }
    const PORT = process.env.PORT || 3000;

    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("Connected to MongoDb");

    const server = app.listen(PORT || 3000, () => {
      console.log(`Listening on port ${PORT}!`);
    });
    const io = socket(server, {
      cors: {
        origin: "https://foxxi-frontend.vercel.app",
        credentials: true,
      },
    });

    let onlineUsers = new Map();
    io.on("connection", (socket: Socket) => {
      let chatSocket = socket;

      socket.on("add-user", (userId: string) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("send-msg", (data: { to: string; message: string }) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
          io.to(sendUserSocket).emit("recieve-msg", data.message);
        }
      });
    });
  } catch (err) {
    console.error(err);
  }
};

start();
