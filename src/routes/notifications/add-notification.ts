import express, { Request, Response } from "express";

import { Notification } from "../../models/Notification";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.post(
  "/api/notification/create",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { notification, userId, notificationType, username, postId } =
        req.body;

      const notificationBuild = Notification.build({
        notification: notification,
        userId: userId,
        notificationType: notificationType,
        username: username,
        postId: postId || null,
      });
      await notificationBuild.save();
      res.status(201).send({ message: "Notification created!" });
    } catch (err) {
      console.log(err);
      res.send({ message: err });
    }
  }
);

export { router as createNotificationRouter };
