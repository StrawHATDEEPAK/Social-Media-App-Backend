"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const currentUser = (req, res, next) => {
    try {
        if (req.headers &&
            req.headers.cookies &&
            req.headers.cookies.includes("foxxi_jwt")) {
            const token = req.headers.cookies
                .toString()
                .split("foxxi_jwt=")[1]
                .split(";")[0];
            if (!token || token === "undefined") {
                req.foxxiUser = undefined;
            }
            else {
                const decoded = jsonwebtoken_1.default.verify(token.toString(), process.env.JWT_KEY);
                if (!decoded) {
                    //If some error occurs
                    res.status(400).json({
                        error: "User not Signed in, Sign in First.",
                    });
                }
                else {
                    req.foxxiUser = decoded;
                }
            }
            next();
        }
        else {
            res.send({ currentuser: null });
        }
    }
    catch (e) {
        res.json({
            currentUser: undefined,
            message: "Malformed jwt token",
        });
    }
};
exports.currentUser = currentUser;
