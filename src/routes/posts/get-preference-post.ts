import { Post } from "../../models/Post";
import express, { Request, Response } from "express";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";
import { BadRequestError } from "@devion/common";

const router = express.Router();
router.post(
  "/api/post/preference",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const hashtagsList = req.body.hashtags;
      console.log("Hashtags list:", hashtagsList);
      const currentUser = await User.findOne({
        username: req.foxxiUser!.username,
      });
      if (!currentUser) {
        throw new BadRequestError("User not found");
      }
      const posts = await Post.find({
        $or: [
          { hashtags: { $in: hashtagsList } },
          { author: { $in: currentUser.following } },
        ],
      })
        .sort({ createdAt: -1 })
        .populate({
          path: "author",
        })
        .populate({
          path: "comments",
          populate: {
            path: "author",
          },
        });
      console.log(posts);
      res.status(200).send(posts);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as preferencePostRouter };
