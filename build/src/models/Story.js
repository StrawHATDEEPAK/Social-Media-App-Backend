"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorySchema = exports.Story = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StorySchema = new mongoose_1.default.Schema({
    caption: {
        type: String,
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    media: {
        type: {
            url: {
                type: String,
            },
            mediatype: {
                type: String,
            },
        },
        default: {
            url: "",
            mediatype: "",
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.StorySchema = StorySchema;
StorySchema.set("timestamps", true);
StorySchema.statics.build = (attrs) => {
    return new Story(attrs);
};
const Story = mongoose_1.default.model("Story", StorySchema);
exports.Story = Story;
