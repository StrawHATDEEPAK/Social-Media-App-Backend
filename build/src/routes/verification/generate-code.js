"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.generateCodeRouter = void 0;
const nodemailer = __importStar(require("nodemailer"));
const express_1 = __importDefault(require("express"));
const Verification_1 = require("../../models/Verification");
const router = express_1.default.Router();
exports.generateCodeRouter = router;
router.post("/api/verification/generate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
        // check if already exists
        const existingVerification = yield Verification_1.Verification.findOne({ email: email });
        if (existingVerification) {
            existingVerification.code = code;
            yield existingVerification.save();
        }
        else {
            // create new verification
            const verification = Verification_1.Verification.build({
                email: email,
                code: code,
            });
            yield verification.save();
        }
        const codeText = `Your verification code is: ${code}. Please Enter this code to verify your account.`;
        const subject = `Verification code from Foxxi`;
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
        var mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: subject,
            text: codeText,
        };
        yield new Promise((resolve, reject) => {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                else {
                    console.log("email sent: " + info.response);
                    resolve(info);
                }
            });
        });
        res.status(200).send({ message: "Verification code sent!" });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ message: e });
    }
}));
