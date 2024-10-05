import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { User } from "../../models/User";

const router = express.Router();

router.put("/api/users/resetpassword", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({
      email: email,
    });

    if (!existingUser) {
      throw new BadRequestError("User not found");
    }

    existingUser.password = password;

    await existingUser.save();

    let userJwt;
    if (email && email.length > 0)
      userJwt = jwt.sign(
        {
          email: existingUser.email,
          username: existingUser.username,
          id: existingUser.id,
        },
        process.env.JWT_KEY!
      );
    else
      userJwt = jwt.sign(
        {
          accountWallet: existingUser.accountWallet,
          username: existingUser.username,
          id: existingUser.id,
        },
        process.env.JWT_KEY!
      );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send({
      jwt: userJwt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
});

export { router as resetPasswordRouter };
