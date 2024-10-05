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
exports.getFollowerFollowingRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.getFollowerFollowingRouter = router;
router.get("/api/users/get/social", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { foxxiUser } = req;
    try {
        if (foxxiUser) {
            const email = foxxiUser.email;
            const accountWallet = foxxiUser.accountWallet;
            let user;
            if (email)
                user = yield User_1.User.findOne({ email: email })
                    .populate({
                    path: "following",
                })
                    .populate({
                    path: "followers",
                });
            else if (accountWallet)
                user = yield User_1.User.findOne({ accountWallet: accountWallet })
                    .populate({
                    path: "following",
                })
                    .populate({
                    path: "followers",
                });
            if (user === null || user === void 0 ? void 0 : user.isBanned)
                return res.json({
                    message: "You are temporarily banned from Foxxi",
                    currentUser: undefined,
                });
            // only get followers and following
            const followers = user === null || user === void 0 ? void 0 : user.followers;
            const following = user === null || user === void 0 ? void 0 : user.following;
            res.json({
                followers: followers,
                following: following,
            });
        }
        else
            res.json({ currentUser: undefined });
    }
    catch (e) {
        console.log("Error: ", e);
        res.json({ currentUser: undefined, error: e });
    }
}));
