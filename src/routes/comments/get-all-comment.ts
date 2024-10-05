import express, { Request, Response } from "express";
import { Comment } from "../../models/Comment";

const router = express.Router();

router.get("/api/comments/getall", async (req: Request, res: Response) => {
  try {
    const comments = await Comment.find({});

    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as getAllCommentRouter };
