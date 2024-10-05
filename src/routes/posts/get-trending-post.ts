import express, { Request, Response } from "express";

import { Post } from "../../models/Post";
import { HashTag } from "../../models/HashTags";
const router = express.Router();

router.get("/api/posts/trending", async (req: Request, res: Response) => {
  try {
    const hashtags = await HashTag.find({}).sort({ useCounter: -1 }).limit(3);
    console.log(hashtags);

    // find the posts concerning the hashtags

    const posts = await Post.find({}).sort({ createdAt: -1 }).populate({
      path: "author",
    });

    let filteredPosts: any = [];
    posts.map((post) => {
      if (
        post.hashtags &&
        post.hashtags.some((tag) =>
          hashtags.map((hashtag) => hashtag.content).includes(tag)
        )
      ) {
        filteredPosts.push(post);
      }
    });

    console.log(filteredPosts);
    res.status(200).send(filteredPosts);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getTrendingPostsRouter };
