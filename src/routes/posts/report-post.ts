import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";

const router = express.Router();

router.put(
  "/api/posts/report",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.body;

      const post = await Post.findOne({
        _id: new mongoose.Types.ObjectId(postId),
      });

      if (!post) {
        throw new BadRequestError("Post not found!");
      }

      if (post.reports?.includes(req.foxxiUser!.id.toString()!)) {
        return res
          .status(400)
          .send({ message: "You have already reported this post!" });
      }

      post.reports!.push(req.foxxiUser!.id!.toString()!);

      await post.save();

      res.status(200).send({ message: "Post reported!" });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as reportPostRouter };
