import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Password } from "../../services/password";
import { Verification } from "../../models/Verification";

const router = express.Router();

router.post(
  "/api/verification/compare",
  async (req: Request, res: Response) => {
    const { code, email } = req.body;

    const existingVerification = await Verification.findOne({
      email: email,
    });
    if (!existingVerification) {
      throw new BadRequestError("email not found");
    }
    console.log(code);

    const passwordsMatch = await Password.compare(
      existingVerification.code!,
      code
    );
    if (!passwordsMatch) {
      throw new BadRequestError("Invalid Code Given");
    }
    existingVerification.code = "verified";
    await existingVerification.save();
    console.log(existingVerification);

    res.status(200).send({ message: "verified" });
  }
);

export { router as verifyCodeRouter };
