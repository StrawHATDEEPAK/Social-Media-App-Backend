"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSchema = exports.Notification = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    notification: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
    },
    notificationType: {
        type: String,
    },
    username: {
        type: String,
    },
    postId: {
        type: String,
        required: false,
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        },
    },
});
exports.NotificationSchema = NotificationSchema;
NotificationSchema.set("timestamps", true);
NotificationSchema.statics.build = (attrs) => {
    return new Notification(attrs);
};
const Notification = mongoose_1.default.model("Notification", NotificationSchema);
exports.Notification = Notification;
