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
exports.importUserOrdinalsRouter = void 0;
const currentuser_1 = require("../../middlewares/currentuser");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const Ordinal_1 = require("../../models/Ordinal");
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.importUserOrdinalsRouter = router;
router.post("/api/token/ordinal/import", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bitcoinWalletAddress } = req.body;
        const { foxxiUser } = req;
        if (!foxxiUser)
            throw new Error("User not found");
        // get user from username
        const existingUser = yield User_1.User.findOne({ username: foxxiUser.username });
        if (!existingUser) {
            throw new Error("User not found!");
        }
        const response = yield axios_1.default.get(`https://api.hiro.so/ordinals/v1/inscriptions?address=${bitcoinWalletAddress}`);
        const ordinals = response.data;
        // create Ordinal documents, if they don't already exist(based on tx_hash)
        for (let i = 0; i < ordinals.length; i++) {
            const ordinal = ordinals[i];
            const ordinalDoc = yield Ordinal_1.Ordinal.findOne({ txId: ordinal.tx_hash });
            if (!ordinalDoc) {
                const newOrdinal = Ordinal_1.Ordinal.build({
                    id: ordinal.id,
                    number: ordinal.number,
                    address: ordinal.address,
                    genesisAddress: ordinal.genesis_address,
                    txId: ordinal.tx_hash,
                    location: ordinal.location,
                    output: ordinal.output,
                    value: ordinal.value,
                    offset: ordinal.offset,
                    satOrdinal: ordinal.sat_ordinal,
                    satRarity: ordinal.sat_rarity,
                    satCoinBaseHeight: ordinal.sat_coinbase_height,
                    mimeType: ordinal.mimetype,
                    contentLength: ordinal.content_length,
                    owner: existingUser,
                });
                yield newOrdinal.save();
            }
        }
        // res.status(200).send(userOrdinals);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
