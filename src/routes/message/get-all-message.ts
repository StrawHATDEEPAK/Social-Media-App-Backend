import express, { Request, Response } from "express";
import { Message } from "../../models/Message";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";
const router = express.Router();

router.post(
  "/api/getmessages",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { from, to } = req.body;
      const messages = await Message.find({ users: { $all: [from, to] } }).sort(
        { updatedAt: 1 }
      );
      const projectedMessages = messages.map((message) => {
        return {
          fromSelf:
            new mongoose.Types.ObjectId(message.sender.id).toString() ===
            new mongoose.Types.ObjectId(from).toString(),
          message: message.message.text,
        };
      });
      res.status(200).send(projectedMessages);
    } catch (e) {
      console.log("Error getting all messages", e);
      res.status(400).send({});
    }
  }
);

export { router as getMessageRouter };
