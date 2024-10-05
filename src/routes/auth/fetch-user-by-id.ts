import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import mongoose from "mongoose";

const router = express.Router();

router.get(
  "/api/users/otheruser/id/:id",
  async (req: Request, res: Response) => {
    console.log(req.params.id);
    try {
      const existingUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
      })
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
  }
);

export { router as fetchUserByIdRouter };
