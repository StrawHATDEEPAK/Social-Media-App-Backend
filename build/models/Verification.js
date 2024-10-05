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
exports.Verification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const password_1 = require("../services/password");
const VerificationSchema = new mongoose_1.default.Schema({
    email: {
        type: String,
    },
    code: {
        type: String,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.code;
            delete ret.__v;
        },
    },
});
VerificationSchema.set("timestamps", true);
VerificationSchema.pre("save", function (done) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("code")) {
            const hashed = yield password_1.Password.toHash(this.get("code"));
            this.set("code", hashed);
        }
        done();
    });
});
VerificationSchema.statics.build = (attrs) => {
    return new Verification(attrs);
};
const Verification = mongoose_1.default.model("Verification", VerificationSchema);
exports.Verification = Verification;
