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
exports.getMessageRouter = void 0;
const express_1 = __importDefault(require("express"));
const Message_1 = require("../../models/Message");
const currentuser_1 = require("../../middlewares/currentuser");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.getMessageRouter = router;
router.post("/api/getmessages", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to } = req.body;
        const messages = yield Message_1.Message.find({ users: { $all: [from, to] } }).sort({ updatedAt: 1 });
        const projectedMessages = messages.map((message) => {
            return {
                fromSelf: new mongoose_1.default.Types.ObjectId(message.sender.id).toString() ===
                    new mongoose_1.default.Types.ObjectId(from).toString(),
                message: message.message.text,
            };
        });
        res.status(200).send(projectedMessages);
    }
    catch (e) {
        console.log("Error getting all messages", e);
        res.status(400).send({});
    }
}));
