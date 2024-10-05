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
exports.getUserOrdinalsFromDBRouter = void 0;
const express_1 = __importDefault(require("express"));
const Ordinal_1 = require("../../models/Ordinal");
const router = express_1.default.Router();
exports.getUserOrdinalsFromDBRouter = router;
router.get("/api/token/ordinal/:userid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userid } = req.params;
        // get all ordinals from Stamp model where owner is userid
        const ordinals = yield Ordinal_1.Ordinal.find({ owner: userid });
        res.status(200).send(ordinals);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ message: error });
    }
}));
