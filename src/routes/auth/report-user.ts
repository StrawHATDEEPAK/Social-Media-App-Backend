import mongoose from "mongoose";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/users/report",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { userId } = req.body;

      const user = await User.findOne({
        _id: new mongoose.Types.ObjectId(userId),
      });

      if (!user) {
        throw new BadRequestError("Post not found!");
      }

      if (user.reports?.includes(req.foxxiUser!.id.toString()!)) {
        return res.status(400).send({
          message: "You have already reported this user!",
        });
      }

      user.reports?.push(req.foxxiUser!.id.toString()!);

      await user.save();

      res.status(200).send({ message: "Post reported!" });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as reportUserRouter };
