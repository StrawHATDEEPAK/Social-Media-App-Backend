import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.put(
  "/api/admin/users/toggleban",
  currentAdmin,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      const existingUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });

      if (!existingUser) {
        throw new BadRequestError("User not found!");
      }

      existingUser.isBanned = !existingUser.isBanned;
      await existingUser.save();

      res.status(200).send({ message: "User Banned!" });
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  } 
);

export { router as toggleBanRouter };
