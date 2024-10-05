import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { Notification } from "../../models/Notification";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.post(
  "/api/admin/notification/createforall",
  currentAdmin,
  async (req: Request, res: Response) => {
    try {
      const { notification, notificationType } = req.body;

      //   create notification for all users
      const users = await User.find({});

      for (let i = 0; i < users.length; i++) {
        const notificationBuild = Notification.build({
          notification: notification,
          userId: users[i].id,
          notificationType: notificationType,
          username: users[i].username!,
          postId: undefined,
        });
        await notificationBuild.save();
      }

      res
        .status(201)
        .send({ message: `Notification created for ${users.length} users!` });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createNotificationForEveryoneRouter };
