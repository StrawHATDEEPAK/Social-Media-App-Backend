import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { Comment } from "../../models/Comment";
import { Post } from "../../models/Post";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.delete(
  "/api/admin/users/:userId",
  currentAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      const deletedUser = await User.deleteOne({
        _id: new mongoose.Types.ObjectId(userId),
      });

      if (!deletedUser) {
        throw new BadRequestError("User not found!");
      }

      // delete all posts  and comments by userId
      await Post.deleteMany({ author: new mongoose.Types.ObjectId(userId) });
      await Comment.deleteMany({ author: new mongoose.Types.ObjectId(userId) });

      res.status(200).send({ message: "User Deleted!" });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as deleteUserRouter };
