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
exports.createReplyRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const Comment_1 = require("../../models/Comment");
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.createReplyRouter = router;
router.post("/api/comments/reply", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId, caption, isReply, parentId } = req.body;
        const post = yield Post_1.Post.findOne({
            _id: new mongoose_1.default.Types.ObjectId(postId),
        });
        if (!post) {
            throw new common_1.BadRequestError("Post not found!");
        }
        const existingUser = yield User_1.User.findOne({
            username: req.foxxiUser.username,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const comment = Comment_1.Comment.build({
            caption: caption,
            author: existingUser,
            postId: post.id,
            isReply: isReply,
            parentId: parentId,
        });
        if (!post.comments) {
            post.comments = [];
        }
        post === null || post === void 0 ? void 0 : post.comments.push(comment);
        yield comment.save();
        yield post.save();
        res.status(201).send(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
