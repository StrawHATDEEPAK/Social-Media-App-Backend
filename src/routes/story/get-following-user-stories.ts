import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/story/getstories",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const existingUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.foxxiUser!.id),
      })
        .populate({
          path: "following",
        })
        .sort({ createdAt: -1 });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      res.status(200).send(existingUser.following);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getFollowingUserStoriesRouter };
