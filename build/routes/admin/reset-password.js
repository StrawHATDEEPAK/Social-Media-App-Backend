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
exports.resetAdminPasswordRouter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const common_1 = require("@devion/common");
const Admin_1 = require("../../models/Admin");
const router = express_1.default.Router();
exports.resetAdminPasswordRouter = router;
router.put("/api/admin/resetpassword", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const existingAdmin = yield Admin_1.Admin.findOne({
            email: email,
        });
        if (!existingAdmin) {
            throw new common_1.BadRequestError("Admin not found");
        }
        existingAdmin.password = password;
        yield existingAdmin.save();
        const userJwt = jsonwebtoken_1.default.sign({
            email: existingAdmin.email,
            username: existingAdmin.username,
            id: existingAdmin.id,
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
