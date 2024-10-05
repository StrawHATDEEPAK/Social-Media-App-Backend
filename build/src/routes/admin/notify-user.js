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
exports.createNotificationforSingleUserRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const Notification_1 = require("../../models/Notification");
const currentadmin_1 = require("../../middlewares/currentadmin");
const router = express_1.default.Router();
exports.createNotificationforSingleUserRouter = router;
router.post("/api/admin/notification/createforone", currentadmin_1.currentAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notification, notificationType, username } = req.body;
        //   create notification for user
        const existingUser = yield User_1.User.findOne({
            username: username,
        });
        if (!existingUser) {
            return res.status(400).send({ message: "User not found!" });
        }
        const notificationBuild = Notification_1.Notification.build({
            notification: notification,
            userId: existingUser.id,
            notificationType: notificationType,
            username: existingUser.username,
            postId: undefined,
        });
        yield notificationBuild.save();
        res.status(201).send({
            message: `Notification created for ${existingUser.username}!`,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
