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
exports.LikePostRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const Post_1 = require("../../models/Post");
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.LikePostRouter = router;
router.put("/api/like", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        console.log("id: ", id);
        const post = yield Post_1.Post.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
        }).populate("author");
        if (!post) {
            throw new common_1.BadRequestError("Post not found");
        }
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        if (post.author.id === existingUser.id) {
            throw new common_1.BadRequestError("You cannot like your own post");
        }
        console.log("post: ", post);
        if (!post.likes) {
            post.likes = [];
            post.likes.push(existingUser);
        }
        else {
            const existingLike = post.likes.find((like) => like.toString() === existingUser.id.toString());
            console.log("existingLike: ", existingLike);
            if (existingLike) {
                post.likes = post.likes.filter((like) => like.toString() !== existingUser.id.toString());
            }
            else {
                post.likes.push(existingUser);
            }
        }
        yield post.save();
        res.send(post);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({
            message: err === null || err === void 0 ? void 0 : err.message,
        });
    }
}));
