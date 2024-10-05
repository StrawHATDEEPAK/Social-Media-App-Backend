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
exports.searchPostRouter = void 0;
const Post_1 = require("../../models/Post");
const express_1 = __importDefault(require("express"));
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.searchPostRouter = router;
router.get("/api/post/search/:searchWord", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Search of post:", req.params.searchWord);
    try {
        const keyword = "#" + req.params.searchWord;
        const post = yield Post_1.Post.find({
            hashtags: { $in: keyword },
        })
            .sort({ createdAt: -1 })
            .populate({
            path: "author",
        })
            .populate({
            path: "comments",
            populate: {
                path: "author",
            },
        });
        console.log(post);
        res.status(200).send(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
