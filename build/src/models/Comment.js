"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentSchema = exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const CommentSchema = new mongoose_1.default.Schema({
    caption: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    postId: {
        type: String,
    },
    isReply: {
        type: Boolean,
        default: false,
    },
    parentId: {
        type: String,
        default: null,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.CommentSchema = CommentSchema;
CommentSchema.set("timestamps", true);
CommentSchema.statics.build = (attrs) => {
    return new Comment(attrs);
};
const Comment = mongoose_1.default.model("Comment", CommentSchema);
exports.Comment = Comment;
