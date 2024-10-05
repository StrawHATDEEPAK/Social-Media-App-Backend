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
exports.repostRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.repostRouter = router;
router.post("/api/reposts/create", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const originalPost = yield Post_1.Post.findById(postId).populate({
            path: "author",
        });
        if (!originalPost) {
            return res.status(404).send({ message: "Post not found!" });
        }
        const existingUser = yield User_1.User.findOne({
            _id: new mongoose_1.default.Types.ObjectId(req.foxxiUser.id),
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        //   return if existingUser is same as author if post
        if (existingUser.id.toString() === originalPost.author.id.toString()) {
            return res
                .status(400)
                .send({ message: "You can't repost your own post!" });
        }
        //   return if the user already reposted the post
        const repostedPost = yield Post_1.Post.findOne({
            originalPostId: originalPost === null || originalPost === void 0 ? void 0 : originalPost._id.toString(),
        });
        if (repostedPost) {
            return res.status(400).send({ message: "Already reposted!" });
        }
        const newCaption = `Original by @${originalPost === null || originalPost === void 0 ? void 0 : originalPost.author.username}: \n${originalPost.caption || ""}`;
        const repost = Post_1.Post.build({
            caption: newCaption || "",
            media: originalPost.media,
            gifLink: ((_a = originalPost.gifLink) === null || _a === void 0 ? void 0 : _a.toString()) || "",
            hashtags: originalPost.hashtags || [],
            author: existingUser,
            originalPostId: originalPost === null || originalPost === void 0 ? void 0 : originalPost._id.toString(),
        });
        originalPost.reposts = originalPost.reposts + 1;
        yield originalPost.save();
        yield repost.save();
        existingUser === null || existingUser === void 0 ? void 0 : existingUser.posts.push(repost);
        yield existingUser.save();
        res.status(201).send({ message: "Repost created!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
