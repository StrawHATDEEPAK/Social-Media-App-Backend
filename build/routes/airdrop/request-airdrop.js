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
exports.airdropRequestRouter = void 0;
const express_1 = __importDefault(require("express"));
const nodemailer = __importStar(require("nodemailer"));
const router = express_1.default.Router();
exports.airdropRequestRouter = router;
router.post("/api/airdrop/request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, walletAddress, message } = req.body;
    try {
        const codeText = `${email} has requested for Foxxi Token Airdrop. Please send 50 Foxxi Tokens to ${walletAddress}. 

Message from ${email}: 
${message}`;
        const subject = `Foxxi Token Airdrop Request`;
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_HELP,
                pass: process.env.GMAIL_HELP_APP_PASSWORD,
            },
        });
        var mailOptions = {
            from: process.env.GMAIL_HELP,
            to: process.env.GMAIL_HELP,
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
        res.status(200).send({
            message: "Airdrop request sent. You will soon receive the foxxi tokens.",
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).send({ message: e });
    }
}));
