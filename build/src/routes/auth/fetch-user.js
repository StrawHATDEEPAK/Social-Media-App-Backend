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
exports.fetchUserRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.fetchUserRouter = router;
router.get("/api/users/otheruser/:nameUser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.nameUser);
    try {
        const existingUser = yield User_1.User.findOne({
            username: req.params.nameUser,
        })
            .populate("followers")
            .populate("following");
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found!");
        }
        res.status(200).send(existingUser);
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
