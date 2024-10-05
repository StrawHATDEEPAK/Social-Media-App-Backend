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
exports.adminSignupRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const Admin_1 = require("../../models/Admin");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
exports.adminSignupRouter = router;
router.post("/api/admin/signup", [
    (0, express_validator_1.body)("username")
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage("Username must be between 3 and 20 characters"),
    (0, express_validator_1.body)("password").trim().notEmpty().withMessage("Password is required"),
], common_1.validateRequest, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        // check if email is provided
        const existingAdmin = yield Admin_1.Admin.findOne({ email: email });
        if (existingAdmin) {
            throw new common_1.BadRequestError("User already signed up");
        }
        const AdminWithSameAdminname = yield Admin_1.Admin.findOne({
            username: username,
        });
        if (AdminWithSameAdminname) {
            throw new common_1.BadRequestError("Username already in use");
        }
        const admin = Admin_1.Admin.build({ email, password, username });
        yield admin.save();
        // Generate JWT
        const AdminJwt = jsonwebtoken_1.default.sign({
            email: admin.email,
            Adminname: admin.username,
            id: admin.id,
        }, process.env.JWT_KEY);
        // Store it on session object
        req.session = {
            jwt: AdminJwt,
        };
        res.status(201).send({
            jwt: AdminJwt,
        });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ message: err });
    }
}));
