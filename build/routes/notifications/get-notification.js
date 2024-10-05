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
exports.getNotificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const Notification_1 = require("../../models/Notification");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.getNotificationRouter = router;
router.get("/api/notification/get", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        console.log("No string", (_a = req.foxxiUser) === null || _a === void 0 ? void 0 : _a.id);
        console.log("currentId", (_b = req.foxxiUser) === null || _b === void 0 ? void 0 : _b.id.toString());
        const notifications = yield Notification_1.Notification.find({
            userId: (_c = req.foxxiUser) === null || _c === void 0 ? void 0 : _c.id.toString(),
        }).sort({
            createdAt: -1,
        });
        res.status(201).send({ data: notifications });
    }
    catch (err) {
        console.log(err);
        res.send({ message: err });
    }
}));
