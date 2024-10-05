import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";

const router = express.Router();

router.get(
  "/api/users/otheruser/:nameUser",
  async (req: Request, res: Response) => {
    console.log(req.params.nameUser);
    try {
      const existingUser = await User.findOne({
        username: req.params.nameUser,
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

export { router as fetchUserRouter };
