import express, { Request, Response } from "express";
import { Ordinal } from "../../models/Ordinal";

const router = express.Router();

router.get(
  "/api/token/ordinal/:userid",
  async (req: Request, res: Response) => {
    try {
      const { userid } = req.params;

      // get all ordinals from Stamp model where owner is userid
      const ordinals = await Ordinal.find({ owner: userid });

      res.status(200).send(ordinals);
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: error });
    }
  }
);

export { router as getUserOrdinalsFromDBRouter };
