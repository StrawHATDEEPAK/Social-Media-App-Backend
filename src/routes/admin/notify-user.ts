import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { Notification } from "../../models/Notification";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.post(
  "/api/admin/notification/createforone",
  currentAdmin,
  async (req: Request, res: Response) => {
    try {
      const { notification, notificationType, username } = req.body;

      //   create notification for user
      const existingUser = await User.findOne({
        username: username,
      });

      if (!existingUser) {
        return res.status(400).send({ message: "User not found!" });
      }

      const notificationBuild = Notification.build({
        notification: notification,
        userId: existingUser.id,
        notificationType: notificationType,
        username: existingUser.username!,
        postId: undefined,
      });
      await notificationBuild.save();

      res.status(201).send({
        message: `Notification created for ${existingUser.username}!`,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createNotificationforSingleUserRouter };
