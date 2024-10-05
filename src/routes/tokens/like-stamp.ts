import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { Stamp } from "../../models/Stamp";
import { User, UserDoc } from "../../models/User";

const router = express.Router();

router.put(
  "/api/token/stamp/like",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { stampId } = req.body;
      const { foxxiUser } = req;

      if (!foxxiUser) throw new Error("User not found");

      const existingUser = await User.findOne({ _id: foxxiUser.id });
      if (!existingUser) throw new Error("User not found!");

      // get all stamps from Stamp model where owner is userid
      const stamp = await Stamp.findById(stampId);
      if (!stamp) throw new Error("Stamp not found");

      if (!stamp.likes) {
        stamp.likes = [];
        stamp.likes.push(existingUser as UserDoc);
      } else {
        const existingLike = stamp.likes.find(
          (like) => like.toString() === existingUser.id.toString()
        );

        if (existingLike) {
          stamp.likes = stamp.likes.filter(
            (like) => like.toString() !== existingUser.id.toString()
          );
        } else {
          stamp.likes.push(existingUser);
        }
      }

      await stamp.save();

      res.status(200).send({ message: "Stamp liked" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as likeStampRouter };
