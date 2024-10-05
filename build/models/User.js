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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const password_1 = require("../services/password");
const userSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
        required: false,
    },
    username: {
        type: String,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: false,
    },
    walletAddress: {
        type: String,
    },
    hasClaimed: {
        type: Boolean,
        default: false,
    },
    image: {
        type: String,
        default: "https://i.pinimg.com/474x/66/ff/cb/66ffcb56482c64bdf6b6010687938835.jpg",
    },
    coverImage: {
        type: String,
    },
    bio: {
        type: String,
        default: "I am a new user",
    },
    followers: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        default: [],
    },
    hashtagsfollowed: {
        type: [
            {
                type: String,
            },
        ],
        default: [],
    },
    posts: {
        type: [
            {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Post",
            },
        ],
        default: [],
    },
    stories: {
        type: Boolean,
        default: false,
    },
    twitterUsername: {
        type: String,
        dafault: "",
    },
    accountWallet: {
        type: String,
        default: "",
        required: false,
    },
    walletType: {
        type: String,
    },
    reports: {
        type: [
            {
                type: String,
            },
        ],
        default: [],
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    preferences: {
        type: [
            {
                type: String,
                default: "",
            },
        ],
        default: [],
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        },
    },
});
userSchema.set("timestamps", true);
userSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("password")) {
            const hashed = yield password_1.Password.toHash(this.get("password"));
            this.set("password", hashed);
        }
        done();
    });
});
userSchema.statics.build = (attrs) => {
    return new User(attrs);
};
const User = mongoose_1.default.model("User", userSchema);
exports.User = User;
