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
exports.addMessageRouter = void 0;
const express_1 = __importDefault(require("express"));
const Message_1 = require("../../models/Message");
const common_1 = require("@devion/common");
const currentuser_1 = require("../../middlewares/currentuser");
const User_1 = require("../../models/User");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.addMessageRouter = router;
router.post("/api/addmessage", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, from, to } = req.body;
        const authUser = yield User_1.User.findOne({
            _id: new mongoose_1.default.Types.ObjectId(from),
        });
        if (!authUser) {
            throw new common_1.NotAuthorizedError();
        }
        const message = Message_1.Message.build({
            message: { text },
            users: [from, to],
            sender: authUser,
        });
        yield message.save();
        res.status(201).send(message);
    }
    catch (e) {
        console.log(e);
        res.send(e);
    }
}));
