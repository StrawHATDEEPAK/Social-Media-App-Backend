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
exports.verifyCodeRouter = void 0;
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const password_1 = require("../../services/password");
const Verification_1 = require("../../models/Verification");
const router = express_1.default.Router();
exports.verifyCodeRouter = router;
router.post("/api/verification/compare", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, email } = req.body;
    const existingVerification = yield Verification_1.Verification.findOne({
        email: email,
    });
    if (!existingVerification) {
        throw new common_1.BadRequestError("email not found");
    }
    console.log(code);
    const passwordsMatch = yield password_1.Password.compare(existingVerification.code, code);
    if (!passwordsMatch) {
        throw new common_1.BadRequestError("Invalid Code Given");
    }
    existingVerification.code = "verified";
    yield existingVerification.save();
    console.log(existingVerification);
    res.status(200).send({ message: "verified" });
}));
