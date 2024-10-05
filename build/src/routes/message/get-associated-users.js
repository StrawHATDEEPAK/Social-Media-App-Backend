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
exports.getAssociatedUsersRouter = void 0;
const express_1 = __importDefault(require("express"));
const Message_1 = require("../../models/Message");
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.getAssociatedUsersRouter = router;
router.get("/api/messages/users", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messages = yield Message_1.Message.find().sort({ updatedAt: 1 });
        console.log("messages", messages);
        let associatedUsers = [];
        for (let i = 0; i < messages.length; i++) {
            let check = messages[i].users.includes(req.foxxiUser.id.toString()) &&
                messages[i].users[0] &&
                messages[i].users[1] &&
                messages[i].users[1].toString() !== messages[i].users[0].toString();
            if (check) {
                associatedUsers.push(messages[i].users[0]);
                associatedUsers.push(messages[i].users[1]);
            }
        }
        let uniqueUsersId = [...new Set(associatedUsers)];
        console.log(uniqueUsersId);
        uniqueUsersId = uniqueUsersId.filter((id) => id !== req.foxxiUser.id.toString());
        console.log("filtered:", uniqueUsersId);
        let uniqueUsers = [];
        for (let i = 0; i < uniqueUsersId.length; i++) {
            const existingUser = yield User_1.User.findOne({
                _id: new mongoose_1.default.Types.ObjectId(uniqueUsersId[i]),
            }).sort({ updatedAt: 1 });
            uniqueUsers.push(existingUser);
        }
        res.status(200).send(uniqueUsers);
    }
    catch (e) {
        console.log("Error getting all messages", e);
        res.status(400).send({});
    }
}));
