import express, { Request, Response } from "express";

import { Story } from "../../models/Story";

const router = express.Router();

router.get("/api/story", async (req: Request, res: Response) => {
  try {
    const stories = await Story.find().sort({ createdAt: -1 }).populate({
      path: "author",
    });

    console.log(stories);
    res.status(200).send(stories);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});

export { router as getAllStoriesRouter };
