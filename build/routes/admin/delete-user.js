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
exports.deleteUserRouter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const Comment_1 = require("../../models/Comment");
const Post_1 = require("../../models/Post");
const currentadmin_1 = require("../../middlewares/currentadmin");
const router = express_1.default.Router();
exports.deleteUserRouter = router;
router.delete("/api/admin/users/:userId", currentadmin_1.currentAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const deletedUser = yield User_1.User.deleteOne({
            _id: new mongoose_1.default.Types.ObjectId(userId),
        });
        if (!deletedUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        // delete all posts  and comments by userId
        yield Post_1.Post.deleteMany({ author: new mongoose_1.default.Types.ObjectId(userId) });
        yield Comment_1.Comment.deleteMany({ author: new mongoose_1.default.Types.ObjectId(userId) });
        res.status(200).send({ message: "User Deleted!" });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
