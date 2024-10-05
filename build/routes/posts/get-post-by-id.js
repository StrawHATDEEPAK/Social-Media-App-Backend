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
exports.getPostRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const router = express_1.default.Router();
exports.getPostRouter = router;
router.get("/api/post/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Id of post:", req.params.id);
    try {
        const post = yield Post_1.Post.findOne({
            _id: new mongoose_1.default.Types.ObjectId(req.params.id),
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
        res.status(200).send(post);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
