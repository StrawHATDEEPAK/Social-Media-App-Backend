import express, { Request, Response } from "express";
import { Message } from "../../models/Message";
import { User } from "../../models/User";
import { currentUser } from "../../middlewares/currentuser";
import mongoose from "mongoose";
const router = express.Router();

router.get(
  "/api/messages/users",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const messages = await Message.find().sort({ updatedAt: 1 });
      console.log("messages", messages);
      let associatedUsers: any = [];
      for (let i = 0; i < messages.length; i++) {
        let check =
          messages[i].users.includes(req.foxxiUser!.id.toString()) &&
          messages[i].users[0] &&
          messages[i].users[1] &&
          messages[i].users[1].toString() !== messages[i].users[0].toString();
        if (check) {
          associatedUsers.push(messages[i].users[0]);
          associatedUsers.push(messages[i].users[1]);
        }
      }
      let uniqueUsersId: any = [...new Set(associatedUsers)];
      console.log(uniqueUsersId);
      uniqueUsersId = uniqueUsersId.filter(
        (id: any) => id !== req.foxxiUser!.id.toString()
      );
      console.log("filtered:", uniqueUsersId);
      let uniqueUsers: any = [];
      for (let i = 0; i < uniqueUsersId.length; i++) {
        const existingUser = await User.findOne({
          _id: new mongoose.Types.ObjectId(uniqueUsersId[i]),
        }).sort({ updatedAt: 1 });
        uniqueUsers.push(existingUser);
      }
      res.status(200).send(uniqueUsers);
    } catch (e) {
      console.log("Error getting all messages", e);
      res.status(400).send({});
    }
  }
);

export { router as getAssociatedUsersRouter };
