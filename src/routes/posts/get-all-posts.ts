import express, { Request, Response } from "express";

import { Post } from "../../models/Post";

const router = express.Router();

router.get("/api/posts", async (req: Request, res: Response) => {
  try {
    const posts = await Post.find({}).sort({ createdAt: -1 }).populate({
      path: "author",
    });
    res.status(200).send(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getAllPostsRouter };
