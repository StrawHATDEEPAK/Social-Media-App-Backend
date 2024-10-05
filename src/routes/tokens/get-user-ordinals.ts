import express, { Request, Response } from "express";
import axios from "axios";

const router = express.Router();

router.get("/api/token/testordinal", async (req: Request, res: Response) => {
  try {
    const { hiroOrdinalAddress, unisatAddress } = req.query;
    let hiroResponse, unisatResponse;

    // get all the ordinals from https://api.hiro.so/ordinals/v1/inscriptions?address=<bitcoinWallet>
    if (hiroOrdinalAddress)
      hiroResponse = await axios.get(
        `https://api.hiro.so/ordinals/v1/inscriptions?address=${hiroOrdinalAddress}`
      );

    if (unisatAddress)
      unisatResponse = await axios.get(
        `https://api.hiro.so/ordinals/v1/inscriptions?address=${unisatAddress}`
      );

    let ordinals: any[] = [];

    if (hiroResponse) ordinals = [...ordinals, ...hiroResponse.data.results];
    if (unisatResponse)
      ordinals = [...ordinals, ...unisatResponse.data.results];

    res.status(200).send(ordinals);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});

export { router as getUserOrdinalsRouter };
