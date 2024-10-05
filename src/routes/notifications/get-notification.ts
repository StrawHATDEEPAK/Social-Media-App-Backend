import express, { Request, Response } from "express";

import { Notification } from "../../models/Notification";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get(
  "/api/notification/get",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      console.log("No string", req.foxxiUser?.id);
      console.log("currentId", req.foxxiUser?.id.toString());
      const notifications = await Notification.find({
        userId: req.foxxiUser?.id.toString(),
      }).sort({
        createdAt: -1,
      });
      res.status(201).send({ data: notifications });
    } catch (err) {
      console.log(err);
      res.send({ message: err });
    }
  }
);

export { router as getNotificationRouter };
