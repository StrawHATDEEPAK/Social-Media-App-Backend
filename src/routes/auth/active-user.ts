import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get(
  "/api/users/active",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const activeUsersRaw = await User.find().sort({ updatedAt: -1 }).limit(5);
      if (!activeUsersRaw) {
        throw new BadRequestError("No Users found!");
      }

      const currentUser = await User.findOne({ email: req.foxxiUser?.email });
      const activeUsers: any[] = [];

      if (!currentUser) throw new BadRequestError("Not authorized!");

      activeUsersRaw.forEach((user) => {
        if (!currentUser.following?.includes(user.id)) {
          activeUsers.push(user);
        }
      });

      res.status(200).send(activeUsers);
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as activeUserRouter };
