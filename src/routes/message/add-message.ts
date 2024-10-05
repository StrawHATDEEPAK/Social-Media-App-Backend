import express, { Request, Response } from "express";
import { Message } from "../../models/Message";
import { NotAuthorizedError } from "@devion/common";
import { currentUser } from "../../middlewares/currentuser";
import { User } from "../../models/User";
import mongoose from "mongoose";
const router = express.Router();

router.post(
  "/api/addmessage",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { text, from, to } = req.body;
      const authUser = await User.findOne({
        _id: new mongoose.Types.ObjectId(from),
      });
      if (!authUser) {
        throw new NotAuthorizedError();
      }
      const message = Message.build({
        message: { text },
        users: [from, to],
        sender: authUser,
      });
      await message.save();
      res.status(201).send(message);
    } catch (e) {
      console.log(e);
      res.send(e);
    }
  }
);

export { router as addMessageRouter };
