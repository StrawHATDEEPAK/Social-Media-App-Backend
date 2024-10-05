import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";

const router = express.Router();

router.get("/api/admin/getusers", async (req: Request, res: Response) => {
  try {
    const existingUser = await User.find()
      .populate("followers")
      .populate("following");
    if (!existingUser) {
      throw new BadRequestError("User not found!");
    }

    res.status(200).send(existingUser);
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

export { router as getAllUserRouter };
