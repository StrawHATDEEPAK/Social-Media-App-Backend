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
exports.updateProfileRouter = void 0;
const express_1 = __importDefault(require("express"));
const cloudinaryConfig_1 = __importDefault(require("../../config/cloudinaryConfig"));
const multer_filefilter_config_1 = __importDefault(require("../../config/multer.filefilter.config"));
const User_1 = require("../../models/User");
const common_1 = require("@devion/common");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.updateProfileRouter = router;
router.put("/api/users/update", currentuser_1.currentUser, multer_filefilter_config_1.default.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, name, bio, walletAddress } = req.body;
        let imageFilePath;
        let coverImageFilePath;
        let imageSecureUrl;
        let coverImageSecureUrl;
        const existingUser = yield User_1.User.findOne({
            username: req.foxxiUser.username,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found");
        }
        // Upload image to cloudinary and create url
        if (req.files) {
            const files = req.files;
            if (files.image && files.image.length > 0) {
                imageFilePath = files.image[0].path;
                var result = yield cloudinaryConfig_1.default.uploader.upload(imageFilePath);
                imageSecureUrl = result.secure_url;
            }
            if (files.coverImage && files.coverImage.length > 0) {
                coverImageFilePath = files.coverImage[0].path;
                var result = yield cloudinaryConfig_1.default.uploader.upload(coverImageFilePath);
                coverImageSecureUrl = result.secure_url;
            }
        }
        // Update user details if they are different, otherwise fallback to existing values
        existingUser.username = username || existingUser.username;
        existingUser.name = name || existingUser.name;
        existingUser.bio = bio || existingUser.bio;
        existingUser.image = imageSecureUrl || existingUser.image;
        existingUser.coverImage = coverImageSecureUrl || existingUser.coverImage;
        existingUser.walletAddress = walletAddress || existingUser.walletAddress;
        if (!existingUser.twitterUsername) {
            existingUser.twitterUsername = req.body.twitterUsername;
        }
        yield existingUser.save();
        res.status(200).send(existingUser);
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
