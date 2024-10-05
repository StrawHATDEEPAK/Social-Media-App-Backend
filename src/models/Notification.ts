import mongoose from "mongoose";
import { UserDoc } from "./User";

interface NotificationAttrs {
  notification: string;
  userId: string;
  notificationType: string;
  username: string;
  postId?: string;
}

interface NotificationModel extends mongoose.Model<NotificationDoc> {
  build(attrs: NotificationAttrs): NotificationDoc;
}

export interface NotificationDoc extends mongoose.Document {
  notification: string;
  userId: string;
  notificationType: string;
  username: string;
  postId?: string;
}

const NotificationSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

NotificationSchema.set("timestamps", true);
NotificationSchema.statics.build = (attrs: NotificationAttrs) => {
  return new Notification(attrs);
};

const Notification = mongoose.model<NotificationDoc, NotificationModel>(
  "Notification",
  NotificationSchema
);

export { Notification, NotificationSchema };
