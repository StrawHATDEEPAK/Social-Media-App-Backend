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
exports.likeStampRouter = void 0;
const currentuser_1 = require("../../middlewares/currentuser");
const express_1 = __importDefault(require("express"));
const Stamp_1 = require("../../models/Stamp");
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.likeStampRouter = router;
router.put("/api/token/stamp/like", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { stampId } = req.body;
        const { foxxiUser } = req;
        if (!foxxiUser)
            throw new Error("User not found");
        const existingUser = yield User_1.User.findOne({ _id: foxxiUser.id });
        if (!existingUser)
            throw new Error("User not found!");
        // get all stamps from Stamp model where owner is userid
        const stamp = yield Stamp_1.Stamp.findById(stampId);
        if (!stamp)
            throw new Error("Stamp not found");
        if (!stamp.likes) {
            stamp.likes = [];
            stamp.likes.push(existingUser);
        }
        else {
            const existingLike = stamp.likes.find((like) => like.toString() === existingUser.id.toString());
            if (existingLike) {
                stamp.likes = stamp.likes.filter((like) => like.toString() !== existingUser.id.toString());
            }
            else {
                stamp.likes.push(existingUser);
            }
        }
        yield stamp.save();
        res.status(200).send({ message: "Stamp liked" });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
