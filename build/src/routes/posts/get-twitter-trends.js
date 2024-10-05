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
exports.getTrendingTweetsRouter = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const twitter_api_v2_1 = require("twitter-api-v2");
const common_1 = require("@devion/common");
const User_1 = require("../../models/User");
const express_1 = __importDefault(require("express"));
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.getTrendingTweetsRouter = router;
dotenv_1.default.config();
router.get("/api/tweets/trending", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { foxxiUser } = req;
    if (!foxxiUser) {
        throw new common_1.BadRequestError("User not found!");
    }
    try {
        const existingUser = yield User_1.User.findOne({
            username: foxxiUser.username,
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const TwitterClient = new twitter_api_v2_1.TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
        });
        const appOnlyClientFromConsumer = yield TwitterClient.appLogin();
        const trendingApiResponse = yield appOnlyClientFromConsumer.v2.search("trending -is:retweet -is:reply -is:quote", {
            max_results: 90,
            "tweet.fields": ["created_at"],
        });
        res.send(trendingApiResponse.data.data);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
