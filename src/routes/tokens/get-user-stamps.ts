import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/api/token/teststamp", async (req: Request, res: Response) => {
  try {
    const { hiroStampAddress, unisatAddress } = req.query;
    let hiroResponse, unisatResponse;

    // get all the ordinals from https://stampchain.io/api/src20
    if (hiroStampAddress)
      hiroResponse = await axios.get(
        `https://stampchain.io/api/src20?creator=${hiroStampAddress}`
      );
    if (unisatAddress)
      unisatResponse = await axios.get(
        `https://stampchain.io/api/src20?creator=${unisatAddress}`
      );

    let stamps: any[] = [];

    if (hiroResponse) {
      stamps = [...stamps, ...hiroResponse.data];
    }

    if (unisatResponse) {
      stamps = [...stamps, ...unisatResponse.data];
    }

    res.status(200).send(stamps);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});

export { router as getUserStampsRouter };
