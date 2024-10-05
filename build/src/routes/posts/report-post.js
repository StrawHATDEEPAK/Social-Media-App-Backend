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
exports.reportPostRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.reportPostRouter = router;
router.put("/api/posts/report", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { postId } = req.body;
        const post = yield Post_1.Post.findOne({
            _id: new mongoose_1.default.Types.ObjectId(postId),
        });
        if (!post) {
            throw new common_1.BadRequestError("Post not found!");
        }
        if ((_a = post.reports) === null || _a === void 0 ? void 0 : _a.includes(req.foxxiUser.id.toString())) {
            return res
                .status(400)
                .send({ message: "You have already reported this post!" });
        }
        post.reports.push(req.foxxiUser.id.toString());
        yield post.save();
        res.status(200).send({ message: "Post reported!" });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
