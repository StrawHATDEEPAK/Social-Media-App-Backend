import express, { Request, Response } from "express";

import { Notification } from "../../models/Notification";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.delete(
  "/api/notification/delete",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const deletedNotifications = await Notification.deleteMany({
        userId: req.foxxiUser?.id.toString(),
      });
      console.log(deletedNotifications);
      res.status(201).send({ message: "Notifications deleted!" });
    } catch (err) {
      console.log(err);
      res.send({ message: err });
    }
  }
);

export { router as deleteNotificationRouter };
