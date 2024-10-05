import mongoose from "mongoose";
import express, { Request, Response } from "express";

import { Post } from "../../models/Post";

const router = express.Router();

router.get("/api/post/:id", async (req: Request, res: Response) => {
  console.log("Id of post:", req.params.id);
  try {
    const post = await Post.findOne({
      _id: new mongoose.Types.ObjectId(req.params.id),
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

    res.status(200).send(post);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getPostRouter };
