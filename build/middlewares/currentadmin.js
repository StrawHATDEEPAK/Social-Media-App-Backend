"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const currentAdmin = (req, res, next) => {
    try {
        if (req.headers &&
            req.headers.cookies &&
            req.headers.cookies.includes("admin_jwt")) {
            const token = req.headers.cookies
                .toString()
                .split("admin_jwt=")[1]
                .split(";")[0];
            if (!token || token === "undefined") {
                req.admin = undefined;
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token.toString(), process.env.JWT_KEY);
                if (!decoded) {
                    //If some error occurs
                    res.status(400).json({
                        error: "Admin not Signed in, Sign in First.",
                    });
                }
                else {
                    req.admin = decoded;
                }
            }
            next();
        }
        else {
            res.send({ currentAdmin: null });
        }
    }
    catch (e) {
        res.status(400).json({
            error: "Malformed jwt token",
        });
    }
};
exports.currentAdmin = currentAdmin;
