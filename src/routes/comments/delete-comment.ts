import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { User } from "../../models/User";
import { Comment } from "../../models/Comment";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.delete(
  "/api/comments/delete/:id",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const comment = await Comment.findOne({
        _id: new mongoose.Types.ObjectId(id),
      });

      if (!comment) {
        throw new BadRequestError("Comment not found!");
      }

      const existingUser = await User.findOne({
        username: req.foxxiUser!.username,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      if (existingUser._id.toString() !== comment.author.toString()) {
        throw new BadRequestError(
          "You are not authorized to delete this comment!"
        );
      }

      const post = await Post.findOne({
        _id: new mongoose.Types.ObjectId(comment.postId),
      });

      if (!post) {
        throw new BadRequestError("Post not found!");
      }

      // filter out the comment from the post
      post.comments = post?.comments!.filter(
        (commentId) => commentId.toString() !== comment._id.toString()
      );

      await post.save();
      await comment.delete();

      res.status(204).send("Comment deleted successfully!");
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as deleteCommentRouter };
