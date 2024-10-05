import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get(
  "/api/posts/feed",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { foxxiUser } = req;
      if (!foxxiUser) {
        throw new BadRequestError("User not found!");
      }

      const existingUser = await User.findOne({
        username: foxxiUser!.username,
      })
        .populate({
          path: "following",
          populate: {
            path: "posts",
          },
        })
        .sort({ createdAt: -1 });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      res.status(200).send(existingUser.following);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as getUserFeedRouter };
