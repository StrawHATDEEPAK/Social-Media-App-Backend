import express, { Response } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";

import { User } from "../../models/User";
import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/preferences/add",
  currentUser,
  async (req: any, res: Response) => {
    try {
      const { preferences } = req.body;
      const existingUser = await User.findOne({
        username: req.foxxiUser!.username,
      });
      if (!existingUser) {
        throw new BadRequestError("User not found");
      }
      console.log(req.body);
      existingUser.preferences = preferences || existingUser.preferences;
      await existingUser.save();
      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as addPreferencesRouter };
