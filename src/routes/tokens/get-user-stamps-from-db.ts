import express, { Request, Response } from "express";
import { Stamp } from "../../models/Stamp";

const router = express.Router();

router.get("/api/token/stamp/:userid", async (req: Request, res: Response) => {
  try {
    const { userid } = req.params;

    // get all stamps from Stamp model where owner is userid
    const stamps = await Stamp.find({ owner: userid });

    res.status(200).send(stamps);
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: error });
  }
});

export { router as getUserStampsFromDBRouter };
