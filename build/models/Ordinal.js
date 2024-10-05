"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdinalSchema = exports.Ordinal = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const OrdinalSchema = new mongoose_1.default.Schema({
    id: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    genesisAddress: {
        type: String,
        required: true,
    },
    txId: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    output: {
        type: String,
        required: true,
    },
    value: {
        type: Number,
        required: true,
    },
    offset: {
        type: Number,
        required: true,
    },
    satOrdinal: {
        type: Number,
        required: true,
    },
    satRarity: {
        type: String,
        required: true,
    },
    satCoinBaseHeight: {
        type: Number,
        required: true,
    },
    mimeType: {
        type: String,
        required: true,
    },
    contentLength: {
        type: Number,
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
exports.OrdinalSchema = OrdinalSchema;
OrdinalSchema.set("timestamps", true);
OrdinalSchema.statics.build = (attrs) => {
    return new Ordinal(attrs);
};
const Ordinal = mongoose_1.default.model("Ordinal", OrdinalSchema);
exports.Ordinal = Ordinal;
