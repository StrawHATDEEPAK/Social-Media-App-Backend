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
exports.adminSigninRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const common_1 = require("@devion/common");
const express_1 = __importDefault(require("express"));
const Admin_1 = require("../../models/Admin");
const password_1 = require("../../services/password");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
exports.adminSigninRouter = router;
router.post("/api/admin/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingAdmin = yield Admin_1.Admin.findOne({ email: email });
        if (!existingAdmin) {
            throw new Error("Admin does not exist!");
        }
        if (existingAdmin.password) {
            const passwordsMatch = yield password_1.Password.compare(existingAdmin.password, password);
            if (!passwordsMatch) {
                throw new common_1.BadRequestError("Invalid Credentials");
            }
        }
        // Generate JWT
        const adminJwt = jsonwebtoken_1.default.sign({
            email: existingAdmin.email,
            adminname: existingAdmin.username,
            id: existingAdmin.id,
        }, process.env.JWT_KEY);
        // Store it on session object
        req.session = {
            jwt: adminJwt,
        };
        res.status(200).send({
            jwt: adminJwt,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
