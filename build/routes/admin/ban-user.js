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
exports.toggleBanRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentadmin_1 = require("../../middlewares/currentadmin");
const router = express_1.default.Router();
exports.toggleBanRouter = router;
router.put("/api/admin/users/toggleban", currentadmin_1.currentAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const existingUser = yield User_1.User.findOne({
            _id: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        existingUser.isBanned = !existingUser.isBanned;
        yield existingUser.save();
        res.status(200).send({ message: "User Banned!" });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
