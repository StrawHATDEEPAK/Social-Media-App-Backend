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
exports.getUserStoriesRouter = void 0;
const express_1 = __importDefault(require("express"));
const Story_1 = require("../../models/Story");
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.getUserStoriesRouter = router;
router.get("/api/story/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.params;
        const existingUser = yield User_1.User.findOne({
            username: username,
        });
        const stories = yield Story_1.Story.find({
            author: existingUser,
        })
            .sort({ createdAt: -1 })
            .populate({
            path: "author",
        });
        res.status(200).send(stories);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
