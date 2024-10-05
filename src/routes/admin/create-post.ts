import path from "path";
import express, { Request, Response } from "express";

import cloudinary from "../../config/cloudinaryConfig";
import upload from "../../config/multer.filefilter.config";
import { Post } from "../../models/Post";
import { User, UserDoc } from "../../models/User";
import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.post(
  "/api/admin/posts/create",
  currentAdmin,
  upload.single("media"),
  async (req: Request, res: Response) => {
    try {
      const { caption } = req.body;
      let foxxiOfficialUser, media;

      if (req.file) {
        const ext = path.extname(req.file!.originalname);
        let result,
          type = null;

        if (
          ext === ".jpg" ||
          ext === ".jpeg" ||
          ext === ".png" ||
          ext === ".gif"
        ) {
          type = "image";
          result = req.file
            ? await cloudinary.uploader.upload(req.file.path)
            : null;
        } else {
          type = "video";
          result = req.file
            ? await cloudinary.uploader.upload(req.file.path, {
                resource_type: "video",
                chunk_size: 6000000,
              })
            : null;
        }

        const mediaUrl = result?.secure_url || "";
        media = {
          url: mediaUrl,
          mediatype: type,
        };
      }

      let existingUser = await User.findOne({
        username: "foxxi",
      });

      if (!existingUser) {
        // create foxxi Official user
        foxxiOfficialUser = User.build({
          username: "foxxi",
          email: process.env.GMAIL!,
          password: process.env.GMAIL_PASSWORD!,
          name: "Foxxi Official",
          bio: "Foxxi Official Account",
        });

        await foxxiOfficialUser.save();
      }

      const post = Post.build({
        caption,
        media,
        author: existingUser || (foxxiOfficialUser as UserDoc),
      });
      existingUser?.posts!.push(post);
      foxxiOfficialUser?.posts!.push(post);

      await post.save();
      await existingUser?.save();
      await foxxiOfficialUser?.save();

      res.status(201).send({
        message: "Post created successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ message: err });
    }
  }
);

export { router as createOfficialPostRouter };
