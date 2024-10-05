"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StampSchema = exports.Stamp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const StampSchema = new mongoose_1.default.Schema({
    stampUrl: {
        type: String,
        required: true,
    },
    op: {
        type: String,
        required: true,
    },
    blockIndex: {
        type: Number,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    amt: {
        type: Number,
        required: true,
    },
    txHash: {
        type: String,
        required: true,
    },
    txIndex: {
        type: Number,
        required: true,
    },
    tick: {
        type: String,
        required: true,
    },
    stamp: {
        type: String,
        required: true,
    },
    p: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.StampSchema = StampSchema;
StampSchema.set("timestamps", true);
StampSchema.statics.build = (attrs) => {
    return new Stamp(attrs);
};
const Stamp = mongoose_1.default.model("Stamp", StampSchema);
exports.Stamp = Stamp;
