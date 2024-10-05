import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { User, UserDoc } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";

const router = express.Router();

router.post(
  "/api/reposts/create",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { postId } = req.body;

      const originalPost = await Post.findById(postId).populate({
        path: "author",
      });

      if (!originalPost) {
        return res.status(404).send({ message: "Post not found!" });
      }

      const existingUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.foxxiUser!.id),
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      //   return if existingUser is same as author if post
      if (existingUser.id.toString() === originalPost.author.id.toString()) {
        return res
          .status(400)
          .send({ message: "You can't repost your own post!" });
      }

      //   return if the user already reposted the post
      const repostedPost = await Post.findOne({
        originalPostId: originalPost?._id.toString(),
      });

      if (repostedPost) {
        return res.status(400).send({ message: "Already reposted!" });
      }

      const newCaption = `Original by @${originalPost?.author.username}: \n${
        originalPost!.caption || ""
      }`;

      const repost = Post.build({
        caption: newCaption || "",
        media: originalPost!.media,
        gifLink: originalPost!.gifLink?.toString() || "",
        hashtags: originalPost!.hashtags || [],
        author: existingUser as UserDoc,
        originalPostId: originalPost?._id.toString(),
      });

      originalPost!.reposts = originalPost!.reposts! + 1;

      await originalPost!.save();
      await repost.save();

      existingUser?.posts!.push(repost);
      await existingUser.save();

      res.status(201).send({ message: "Repost created!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as repostRouter };
