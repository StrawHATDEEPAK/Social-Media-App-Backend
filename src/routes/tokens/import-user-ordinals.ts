import { currentUser } from "../../middlewares/currentuser";
import express, { Request, Response } from "express";
import axios from "axios";
import { Ordinal } from "../../models/Ordinal";
import { User, UserDoc } from "../../models/User";

const router = express.Router();

router.post(
  "/api/token/ordinal/import",
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

      const response = await axios.get(
        `https://api.hiro.so/ordinals/v1/inscriptions?address=${existingUser.ordinalAddress}`
      );
      const ordinals = response.data;

      // create Ordinal documents, if they don't already exist(based on tx_hash)
      for (let i = 0; i < ordinals.length; i++) {
        const ordinal = ordinals[i];
        const ordinalDoc = await Ordinal.findOne({ txId: ordinal.tx_hash });
        if (!ordinalDoc) {
          const newOrdinal = Ordinal.build({
            id: ordinal.id,
            number: ordinal.number,
            address: ordinal.address,
            genesisAddress: ordinal.genesis_address,
            txId: ordinal.tx_hash,
            location: ordinal.location,
            output: ordinal.output,
            value: ordinal.value,
            offset: ordinal.offset,
            satOrdinal: ordinal.sat_ordinal,
            satRarity: ordinal.sat_rarity,
            satCoinBaseHeight: ordinal.sat_coinbase_height,
            mimeType: ordinal.mimetype,
            contentLength: ordinal.content_length,
            owner: existingUser as UserDoc,
          });
          await newOrdinal.save();
        }
      }

      // res.status(200).send(userOrdinals);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as importUserOrdinalsRouter };
