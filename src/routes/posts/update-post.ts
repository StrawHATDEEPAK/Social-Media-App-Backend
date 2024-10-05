import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { UserDoc } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
import { HashTag } from "../../models/HashTags";

const router = express.Router();

router.put(
  "/api/posts/edit/:id",
  currentUser,
  async (req: Request, res: Response) => {
    const { caption, hashtags } = req.body;
    const { id } = req.params;
    const user = req.foxxiUser as UserDoc;
    console.log("Caption is:", caption);
    const post = await Post.findById(new mongoose.Types.ObjectId(id)).populate(
      "author"
    );

    if (!post) {
      throw new BadRequestError("Post not found");
    }

    if (post.author.id !== user.id) {
      return res.send({ message: "You are not authorized to edit this post" });
    }

    if (post.originalPostId) {
      throw new BadRequestError("You can't edit reposted posts");
    }
    // Reduce count of previous hashtags
    for (let i = 0; i < post.hashtags!.length; i++) {
      const existingHashtag = await HashTag.findOne({
        content: hashtags,
      });
      if (existingHashtag) {
        existingHashtag.useCounter = existingHashtag.useCounter - 1;
        await existingHashtag.save();
      }
    }
    // Save the hashtags in hashtag db
    if (hashtags) {
      if (typeof hashtags === "string") {
        const existingHashtag = await HashTag.findOne({
          content: hashtags,
        });
        if (existingHashtag) {
          existingHashtag.useCounter = existingHashtag.useCounter + 1;
          await existingHashtag.save();
        } else {
          const newHashtag = HashTag.build({
            content: hashtags,
            useCounter: 1,
          });
          await newHashtag.save();
        }
      } else {
        for (let i = 0; i < hashtags.length; i++) {
          console.log(hashtags[i]);
          const existingHashtag = await HashTag.findOne({
            content: hashtags[i],
          });
          if (existingHashtag) {
            existingHashtag.useCounter = existingHashtag.useCounter + 1;
            await existingHashtag.save();
          } else {
            const newHashtag = HashTag.build({
              content: hashtags[i],
              useCounter: 1,
            });
            await newHashtag.save();
          }
        }
      }
    }
    post.caption = caption;
    post.hashtags = hashtags || post.hashtags;
    await post.save();

    res.send(post);
  }
);

export { router as updatePostRouter };
