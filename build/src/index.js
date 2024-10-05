"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("./app");
const dotenv_1 = __importDefault(require("dotenv"));
const socket = require("socket.io");
dotenv_1.default.config();
const start = () => __awaiter(void 0, void 0, void 0, function* () {
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
        mongoose_1.default.set("strictQuery", true);
        yield mongoose_1.default.connect(process.env.MONGO_URI, {});
        console.log("Connected to MongoDb");
        const server = app_1.app.listen(PORT || 3000, () => {
            console.log(`Listening on port ${PORT}!`);
        });
        const io = socket(server, {
            cors: {
                origin: "https://foxxi-frontend.vercel.app",
                credentials: true,
            },
        });
        let onlineUsers = new Map();
        io.on("connection", (socket) => {
            let chatSocket = socket;
            socket.on("add-user", (userId) => {
                onlineUsers.set(userId, socket.id);
            });
            socket.on("send-msg", (data) => {
                const sendUserSocket = onlineUsers.get(data.to);
                if (sendUserSocket) {
                    io.to(sendUserSocket).emit("recieve-msg", data.message);
                }
            });
        });
    }
    catch (err) {
        console.error(err);
    }
});
start();
