import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { User } from "../../models/User";
import { Password } from "../../services/password";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/users/updatepassword",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const existingUser = await User.findOne({
        username: req.foxxiUser!.username,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found");
      }

      const passwordsMatch = await Password.compare(
        existingUser.password!,
        oldPassword
      );

      if (!passwordsMatch) {
        throw new BadRequestError("Incorrect password");
      }

      existingUser.password = newPassword;

      await existingUser.save();

      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as updatePasswordRouter };
