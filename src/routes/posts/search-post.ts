import { Post } from "../../models/Post";
import express, { Request, Response } from "express";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get(
  "/api/post/search/:searchWord",
  currentUser,
  async (req: Request, res: Response) => {
    console.log("Search of post:", req.params.searchWord);
    try {
      const keyword = "#" + req.params.searchWord;
      const post = await Post.find({
        hashtags: { $in: keyword },
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
      console.log(post);
      res.status(200).send(post);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as searchPostRouter };
