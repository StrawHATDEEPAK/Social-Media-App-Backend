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
exports.createNotificationForEveryoneRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const Notification_1 = require("../../models/Notification");
const currentadmin_1 = require("../../middlewares/currentadmin");
const router = express_1.default.Router();
exports.createNotificationForEveryoneRouter = router;
router.post("/api/admin/notification/createforall", currentadmin_1.currentAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notification, notificationType } = req.body;
        //   create notification for all users
        const users = yield User_1.User.find({});
        for (let i = 0; i < users.length; i++) {
            const notificationBuild = Notification_1.Notification.build({
                notification: notification,
                userId: users[i].id,
                notificationType: notificationType,
                username: users[i].username,
                postId: undefined,
            });
            yield notificationBuild.save();
        }
        res
            .status(201)
            .send({ message: `Notification created for ${users.length} users!` });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
