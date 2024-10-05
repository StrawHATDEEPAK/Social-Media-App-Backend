import express, { Request, Response } from "express";

import { Story } from "../../models/Story";
import { User } from "../../models/User";

const router = express.Router();

router.get("/api/story/:username", async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({
      username: username,
    });

    const stories = await Story.find({
      author: existingUser,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
      });

    res.status(200).send(stories);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});

export { router as getUserStoriesRouter };
