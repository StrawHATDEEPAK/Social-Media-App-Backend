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
exports.createPostRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Post_1 = require("../../models/Post");
const HashTags_1 = require("../../models/HashTags");
const User_1 = require("../../models/User");
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const multer_filefilter_config_1 = __importDefault(require("../../config/multer.filefilter.config"));
const currentuser_1 = require("../../middlewares/currentuser");
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
exports.createPostRouter = router;
router.post("/api/posts/create", currentuser_1.currentUser, multer_filefilter_config_1.default.single("media"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption, gifLink, hashtags } = req.body;
        console.log(hashtags);
        let media;
        if (req.file) {
            const ext = path_1.default.extname(req.file.originalname);
            let result, type = null;
            if (ext === ".jpg" ||
                ext === ".jpeg" ||
                ext === ".png" ||
                ext === ".gif") {
                type = "image";
                result = req.file
                    ? yield cloudinaryConfig_1.default.uploader.upload(req.file.path)
                    : null;
            }
            else {
                type = "video";
                result = req.file
                    ? yield cloudinaryConfig_1.default.uploader.upload(req.file.path, {
                        resource_type: "video",
                        chunk_size: 6000000,
                    })
                    : null;
            }
            const mediaUrl = (result === null || result === void 0 ? void 0 : result.secure_url) || "";
            media = {
                url: mediaUrl,
                mediatype: type,
            };
        }
        const existingUser = yield User_1.User.findOne({
            _id: req.foxxiUser.id,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        const post = Post_1.Post.build({
            caption,
            media,
            gifLink,
            hashtags: hashtags || [],
            author: existingUser,
        });
        existingUser === null || existingUser === void 0 ? void 0 : existingUser.posts.push(post);
        yield post.save();
        yield existingUser.save();
        // Save the hashtags in hashtag db
        if (hashtags) {
            if (typeof hashtags === "string") {
                const existingHashtag = yield HashTags_1.HashTag.findOne({
                    content: hashtags,
                });
                if (existingHashtag) {
                    existingHashtag.useCounter = existingHashtag.useCounter + 1;
                    yield existingHashtag.save();
                }
                else {
                    const newHashtag = HashTags_1.HashTag.build({
                        content: hashtags,
                        useCounter: 1,
                    });
                    yield newHashtag.save();
                }
            }
            else {
                for (let i = 0; i < hashtags.length; i++) {
                    console.log(hashtags[i]);
                    const existingHashtag = yield HashTags_1.HashTag.findOne({
                        content: hashtags[i],
                    });
                    if (existingHashtag) {
                        existingHashtag.useCounter = existingHashtag.useCounter + 1;
                        yield existingHashtag.save();
                    }
                    else {
                        const newHashtag = HashTags_1.HashTag.build({
                            content: hashtags[i],
                            useCounter: 1,
                        });
                        yield newHashtag.save();
                    }
                }
            }
        }
        res.status(201).send({
            message: "Post created successfully",
            post: post,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
