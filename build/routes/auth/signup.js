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
exports.signupRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const Verification_1 = require("../../models/Verification");
const password_1 = require("../../services/password");
const User_1 = require("../../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
exports.signupRouter = router;
router.post("/api/users/signup", [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    (0, express_validator_1.body)("name").trim().notEmpty().withMessage("Name is required"),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username, name, accountWallet, walletType } = req.body;
        // check if email is provided
        let existingUser;
        if (email && email.length > 0)
            existingUser = yield User_1.User.findOne({ email });
        else
            existingUser = yield User_1.User.findOne({ accountWallet });
        if (existingUser) {
            throw new common_1.BadRequestError("Account already in use");
        }
        const userWithSameUsername = yield User_1.User.findOne({ username });
        if (userWithSameUsername) {
            throw new common_1.BadRequestError("Username already in use");
        }
        let user;
        if (email && email.length > 0) {
            user = User_1.User.build({ email, password, username, name });
            const existingVerification = yield Verification_1.Verification.findOne({
                email: email,
            });
            if (!existingVerification) {
                return res.status(400).send({ message: "Verify Yourself First!" });
            }
            const passwordsMatch = yield password_1.Password.compare(existingVerification.code, "verified");
            if (!passwordsMatch) {
                return res.status(400).send({ message: "Verify Yourself First!" });
            }
            const deleteVerification = yield Verification_1.Verification.deleteOne({
                email: email,
            });
            console.log(deleteVerification);
        }
        else
            user = User_1.User.build({ username, name, accountWallet, walletType });
        yield user.save();
        // Generate JWT
        let userJwt;
        if (email && email.length > 0)
            userJwt = jsonwebtoken_1.default.sign({
                email: user.email,
                username: user.username,
                id: user.id,
            }, process.env.JWT_KEY);
        else
            userJwt = jsonwebtoken_1.default.sign({
                accountWallet: user.accountWallet,
                username: user.username,
                id: user.id,
            }, process.env.JWT_KEY);
        // Store it on session object
        req.session = {
            jwt: userJwt,
        };
        res.status(201).send({
            jwt: userJwt,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
