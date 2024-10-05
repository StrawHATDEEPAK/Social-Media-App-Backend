import express, { Response } from "express";
import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";

import { User } from "../../models/User";
import { BadRequestError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.put(
  "/api/users/update",
  currentUser,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  async (req: any, res: Response) => {
    try {
      const {
        username,
        name,
        bio,
        walletAddress,
        ordinalAddress,
        stampAddress,
        unisatAddress,
      } = req.body;
      let imageFilePath: any;
      let coverImageFilePath: any;
      let imageSecureUrl: any;
      let coverImageSecureUrl: any;
      const existingUser = await User.findOne({
        username: req.foxxiUser!.username,
      });

      if (!existingUser) {
        throw new BadRequestError("User not found");
      }
      // Upload image to cloudinary and create url
      if (req.files) {
        const files = req.files;
        if (files.image && files.image.length > 0) {
          imageFilePath = files.image[0].path;
          var result = await cloudinary.uploader.upload(imageFilePath);
          imageSecureUrl = result.secure_url;
        }
        if (files.coverImage && files.coverImage.length > 0) {
          coverImageFilePath = files.coverImage[0].path;
          var result = await cloudinary.uploader.upload(coverImageFilePath);
          coverImageSecureUrl = result.secure_url;
        }
      }
      // Update user details if they are different, otherwise fallback to existing values
      existingUser.username = username || existingUser.username;
      existingUser.name = name || existingUser.name;
      existingUser.bio = bio || existingUser.bio;
      existingUser.image = imageSecureUrl || existingUser.image;
      existingUser.coverImage = coverImageSecureUrl || existingUser.coverImage;
      existingUser.walletAddress = walletAddress || existingUser.walletAddress;
      existingUser.ordinalAddress =
        ordinalAddress || existingUser.ordinalAddress;
      existingUser.stampAddress = stampAddress || existingUser.stampAddress;
      existingUser.unisatAddress = unisatAddress || existingUser.unisatAddress;

      if (!existingUser.twitterUsername) {
        existingUser.twitterUsername = req.body.twitterUsername;
      }

      await existingUser.save();

      res.status(200).send(existingUser);
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as updateProfileRouter };
