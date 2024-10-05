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
exports.followUserRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.followUserRouter = router;
router.put("/api/follow/users", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { username } = req.body;
        const existingUser = yield User_1.User.findOne({ _id: req.foxxiUser.id });
        const existingUserToFollow = yield User_1.User.findOne({ username: username });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        if (!existingUserToFollow) {
            throw new common_1.BadRequestError("User to follow not found!");
        }
        if (existingUser.id === existingUserToFollow.id) {
            throw new common_1.BadRequestError("You cannot follow yourself!");
        }
        const existingFollow = yield User_1.User.findOne({
            _id: existingUserToFollow.id,
            followers: {
                _id: existingUser.id,
            },
        });
        if (existingFollow) {
            // Remove the user from the following array
            existingUser.following = (_a = existingUser.following) === null || _a === void 0 ? void 0 : _a.filter((user) => user._id.toString() !== existingUserToFollow._id.toString());
            // Remove the user from the followers array
            existingUserToFollow.followers = (_b = existingUserToFollow.followers) === null || _b === void 0 ? void 0 : _b.filter((user) => user._id.toString() !== existingUser._id.toString());
            yield existingUser.save();
            yield existingUserToFollow.save();
            return res.status(200).send({ message: "User Unfollowed!" });
        }
        else {
            (_c = existingUser.following) === null || _c === void 0 ? void 0 : _c.push(existingUserToFollow);
            (_d = existingUserToFollow.followers) === null || _d === void 0 ? void 0 : _d.push(existingUser);
            yield existingUser.save();
            yield existingUserToFollow.save();
            res.status(201).send({ message: "User Followed!" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
