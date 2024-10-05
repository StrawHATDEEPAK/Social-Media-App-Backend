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
exports.createOfficialPostRouter = void 0;
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const multer_filefilter_config_1 = __importDefault(require("../../config/multer.filefilter.config"));
const Post_1 = require("../../models/Post");
const User_1 = require("../../models/User");
const currentadmin_1 = require("../../middlewares/currentadmin");
const router = express_1.default.Router();
exports.createOfficialPostRouter = router;
router.post("/api/admin/posts/create", currentadmin_1.currentAdmin, multer_filefilter_config_1.default.single("media"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { caption } = req.body;
        let foxxiOfficialUser, media;
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
        let existingUser = yield User_1.User.findOne({
            username: "foxxi",
        });
        if (!existingUser) {
            // create foxxi Official user
            foxxiOfficialUser = User_1.User.build({
                username: "foxxi",
                email: process.env.GMAIL,
                password: process.env.GMAIL_PASSWORD,
                name: "Foxxi Official",
                bio: "Foxxi Official Account",
            });
            yield foxxiOfficialUser.save();
        }
        const post = Post_1.Post.build({
            caption,
            media,
            author: existingUser || foxxiOfficialUser,
        });
        existingUser === null || existingUser === void 0 ? void 0 : existingUser.posts.push(post);
        foxxiOfficialUser === null || foxxiOfficialUser === void 0 ? void 0 : foxxiOfficialUser.posts.push(post);
        yield post.save();
        yield (existingUser === null || existingUser === void 0 ? void 0 : existingUser.save());
        yield (foxxiOfficialUser === null || foxxiOfficialUser === void 0 ? void 0 : foxxiOfficialUser.save());
        res.status(201).send({
            message: "Post created successfully",
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
