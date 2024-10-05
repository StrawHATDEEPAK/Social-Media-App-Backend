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
exports.importUserStampsRouter = void 0;
const currentuser_1 = require("../../middlewares/currentuser");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const Stamp_1 = require("../../models/Stamp");
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.importUserStampsRouter = router;
router.post("/api/token/stamp/import", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { foxxiUser } = req;
        if (!foxxiUser)
            throw new Error("User not found");
        // get user from username
        const existingUser = yield User_1.User.findOne({ username: foxxiUser.username });
        if (!existingUser) {
            throw new Error("User not found!");
        }
        const response = yield axios_1.default.get(`https://stampchain.io/api/src20`);
        const stamps = response.data;
        const userStamps = stamps.filter((ordinal) => ordinal.creator === existingUser.stampAddress);
        // create Ordinal documents, if they don't already exist(based on tx_hash)
        for (let i = 0; i < userStamps.length; i++) {
            const stamp = userStamps[i];
            const stampDoc = yield Stamp_1.Stamp.findOne({ txHash: stamp.tx_hash });
            if (!stampDoc) {
                const newStamp = Stamp_1.Stamp.build({
                    stampUrl: stamp.stamp_url,
                    op: stamp.op,
                    txIndex: stamp.tx_index,
                    blockIndex: stamp.block_index,
                    amt: stamp.amt,
                    tick: stamp.tick,
                    txHash: stamp.tx_hash,
                    creator: stamp.creator,
                    p: stamp.p,
                    stamp: stamp.stamp,
                    owner: existingUser,
                });
                yield newStamp.save();
            }
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
