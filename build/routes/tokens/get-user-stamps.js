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
exports.getUserStampsRouter = void 0;
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
exports.getUserStampsRouter = router;
router.get("/api/token/teststamp/:bitcoinWalletAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bitcoinWalletAddress } = req.params;
        // get all the ordinals from https://stampchain.io/api/src20
        const response = yield axios_1.default.get(`https://stampchain.io/api/src20`);
        const stamps = response.data;
        // filter the ordinals.items to only include the ones that have the bitcoinWalletAddress in the creator field
        const userStamps = stamps.items.filter((ordinal) => ordinal.creator === bitcoinWalletAddress);
        res.status(200).send(userStamps);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
