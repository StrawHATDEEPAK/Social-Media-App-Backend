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
exports.resetPasswordRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const User_1 = require("../../models/User");
const router = express_1.default.Router();
exports.resetPasswordRouter = router;
router.put("/api/users/resetpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingUser = yield User_1.User.findOne({
            email: email,
        });
        if (!existingUser) {
            throw new common_1.BadRequestError("User not found");
        }
        existingUser.password = password;
        yield existingUser.save();
        let userJwt;
        if (email && email.length > 0)
            userJwt = jsonwebtoken_1.default.sign({
                email: existingUser.email,
                username: existingUser.username,
                id: existingUser.id,
            }, process.env.JWT_KEY);
        else
            userJwt = jsonwebtoken_1.default.sign({
                accountWallet: existingUser.accountWallet,
                username: existingUser.username,
                id: existingUser.id,
            }, process.env.JWT_KEY);
        // Store it on session object
        req.session = {
            jwt: userJwt,
        };
        res.status(200).send({
            jwt: userJwt,
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).send({ message: err });
    }
}));
