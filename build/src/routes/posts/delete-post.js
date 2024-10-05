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
exports.deletePostRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const currentuser_1 = require("../../middlewares/currentuser");
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
exports.deletePostRouter = router;
router.delete("/api/posts/delete/:id", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const existingPost = yield Post_1.Post.findOne({
            _id: new mongoose_1.default.Types.ObjectId(id),
        }).populate("author");
        if (!existingPost) {
            throw new common_1.BadRequestError("Post not found!");
        }
        if (existingPost.author.id !== ((_a = req.foxxiUser) === null || _a === void 0 ? void 0 : _a.id)) {
            throw new common_1.BadRequestError("You are not the author!");
        }
        // decrement original posts reposts
        if (existingPost.originalPostId) {
            const originalPost = yield Post_1.Post.findOne({
                _id: new mongoose_1.default.Types.ObjectId(existingPost.originalPostId),
            });
            if (!originalPost) {
                throw new common_1.BadRequestError("Original post not found!");
            }
            originalPost.reposts = originalPost.reposts - 1;
            yield originalPost.save();
        }
        yield Post_1.Post.deleteOne({ _id: new mongoose_1.default.Types.ObjectId(id) });
        res.status(204).send({ message: "Post deleted!" });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
