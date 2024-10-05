import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import { Ordinal } from "../../models/Ordinal";
import { User, UserDoc } from "../../models/User";

const router = express.Router();

router.put(
  "/api/token/ordinal/like",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { ordinalId } = req.body;
      const { foxxiUser } = req;

      if (!foxxiUser) throw new Error("User not found");

      const existingUser = await User.findOne({ _id: foxxiUser.id });
      if (!existingUser) throw new Error("User not found!");

      // get all ordinals from Stamp model where owner is userid
      const ordinal = await Ordinal.findById(ordinalId);
      if (!ordinal) throw new Error("Ordinal not found");

      if (!ordinal.likes) {
        ordinal.likes = [];
        ordinal.likes.push(existingUser as UserDoc);
      } else {
        const existingLike = ordinal.likes.find(
          (like) => like.toString() === existingUser.id.toString()
        );

        if (existingLike) {
          ordinal.likes = ordinal.likes.filter(
            (like) => like.toString() !== existingUser.id.toString()
          );
        } else {
          ordinal.likes.push(existingUser);
        }
      }

      await ordinal.save();

      res.status(200).send({ message: "Ordinal liked" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as likeOrdinalRouter };
