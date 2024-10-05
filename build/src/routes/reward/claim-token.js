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
exports.claimTokenRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const currentuser_1 = require("../../middlewares/currentuser");
const router = express_1.default.Router();
exports.claimTokenRouter = router;
router.get("/api/reward/claim", currentuser_1.currentUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { hasClaimed } = req.body;
        const existingUser = yield User_1.User.findOne({
            username: (_a = req.foxxiUser) === null || _a === void 0 ? void 0 : _a.username,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        existingUser.hasClaimed = true;
        yield existingUser.save();
        res.status(200).send({ message: "Token Claimed Successfully!" });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
