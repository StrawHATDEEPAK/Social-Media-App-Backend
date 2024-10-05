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
exports.getTrendingPostsRouter = void 0;
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const HashTags_1 = require("../../models/HashTags");
const router = express_1.default.Router();
exports.getTrendingPostsRouter = router;
router.get("/api/posts/trending", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashtags = yield HashTags_1.HashTag.find({}).sort({ useCounter: -1 }).limit(3);
        console.log(hashtags);
        // find the posts concerning the hashtags
        const posts = yield Post_1.Post.find({}).sort({ createdAt: -1 }).populate({
            path: "author",
        });
        let filteredPosts = [];
        posts.map((post) => {
            if (post.hashtags &&
                post.hashtags.some((tag) => hashtags.map((hashtag) => hashtag.content).includes(tag))) {
                filteredPosts.push(post);
            }
        });
        console.log(filteredPosts);
        res.status(200).send(filteredPosts);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
