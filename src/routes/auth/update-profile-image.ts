import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/users/imageupdate",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { image } = req.body;
      let existingUser;
      if (req.foxxiUser!.email)
        existingUser = await User.findOne({
          email: req.foxxiUser!.email,
        });
      else
        existingUser = await User.findOne({
          accountWallet: req.foxxiUser!.accountWallet,
        });

      if (!existingUser) {
        throw new BadRequestError("User not found");
      }
      existingUser.image = image || existingUser.image;
      await existingUser.save();

      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as updateProfileImageRouter };
