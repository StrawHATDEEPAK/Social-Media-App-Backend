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
exports.updateCommentRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const Comment_1 = require("../../models/Comment");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.updateCommentRouter = router;
router.post("/api/comments/update", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption, id } = req.body;
        console.log("Updating caption: ", caption, " for comment id: ", id);
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
            throw new common_1.BadRequestError("You are not authorized to update this comment!");
        }
        comment.caption = caption || comment.caption;
        yield comment.save();
        res.status(201).send("Comment updated successfully!");
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
