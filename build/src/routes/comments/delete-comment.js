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
exports.deleteCommentRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const User_1 = require("../../models/User");
const Comment_1 = require("../../models/Comment");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.deleteCommentRouter = router;
router.delete("/api/comments/delete/:id", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const comment = yield Comment_1.Comment.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
        });
        if (!comment) {
            throw new common_1.BadRequestError("Comment not found!");
        }
        const existingUser = yield User_1.User.findOne({
            username: req.foxxiUser.username,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        if (existingUser._id.toString() !== comment.author.toString()) {
            throw new common_1.BadRequestError("You are not authorized to delete this comment!");
        }
        const post = yield Post_1.Post.findOne({
            _id: new mongoose_1.default.Types.ObjectId(comment.postId),
        });
        if (!post) {
            throw new common_1.BadRequestError("Post not found!");
        }
        // filter out the comment from the post
        post.comments = post === null || post === void 0 ? void 0 : post.comments.filter((commentId) => commentId.toString() !== comment._id.toString());
        yield post.save();
        yield comment.delete();
        res.status(204).send("Comment deleted successfully!");
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
