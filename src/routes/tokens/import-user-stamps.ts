import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import axios from "axios";
import { Stamp } from "../../models/Stamp";
import { User, UserDoc } from "../../models/User";

const router = express.Router();

router.post(
  "/api/token/stamp/import",
  currentUser,
  async (req: Request, res: Response) => {
    try {
      const { foxxiUser } = req;

      if (!foxxiUser) throw new Error("User not found");

      // get user from username
      const existingUser = await User.findOne({ username: foxxiUser.username });
      if (!existingUser) {
        throw new Error("User not found!");
      }

      const response = await axios.get(`https://stampchain.io/api/src20`);
      const stamps = response.data;

      const userStamps = stamps.filter(
        (ordinal: { creator: string }) =>
          ordinal.creator === existingUser.stampAddress
      );

      // create Ordinal documents, if they don't already exist(based on tx_hash)
      for (let i = 0; i < userStamps.length; i++) {
        const stamp = userStamps[i];
        const stampDoc = await Stamp.findOne({ txHash: stamp.tx_hash });
        if (!stampDoc) {
          const newStamp = Stamp.build({
            stampUrl: stamp.stamp_url,
            op: stamp.op,
            txIndex: stamp.tx_index,
            blockIndex: stamp.block_index,
            amt: stamp.amt,
            tick: stamp.tick,
            txHash: stamp.tx_hash,
            creator: stamp.creator,
            p: stamp.p,
            stamp: stamp.stamp,
            owner: existingUser as UserDoc,
          });
          await newStamp.save();
        }
      }
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as importUserStampsRouter };
