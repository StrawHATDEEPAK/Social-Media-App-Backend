"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashTagSchema = exports.HashTag = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const HashTagSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
    },
    useCounter: {
        type: Number,
        default: 0,
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
exports.HashTagSchema = HashTagSchema;
HashTagSchema.statics.build = (attrs) => {
    return new HashTag(attrs);
};
const HashTag = mongoose_1.default.model("HashTag", HashTagSchema);
exports.HashTag = HashTag;
