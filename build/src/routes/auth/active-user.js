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
exports.activeUserRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.activeUserRouter = router;
router.get("/api/users/active", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const activeUsersRaw = yield User_1.User.find().sort({ updatedAt: -1 }).limit(5);
        if (!activeUsersRaw) {
            throw new common_1.BadRequestError("No Users found!");
        }
        const currentUser = yield User_1.User.findOne({ email: (_a = req.foxxiUser) === null || _a === void 0 ? void 0 : _a.email });
        const activeUsers = [];
        if (!currentUser)
            throw new common_1.BadRequestError("Not authorized!");
        activeUsersRaw.forEach((user) => {
            var _a;
            if (!((_a = currentUser.following) === null || _a === void 0 ? void 0 : _a.includes(user.id))) {
                activeUsers.push(user);
            }
        });
        res.status(200).send(activeUsers);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
