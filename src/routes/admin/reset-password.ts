import jwt from "jsonwebtoken";
import express, { Request, Response } from "express";

import { BadRequestError } from "@devion/common";
import { Admin } from "../../models/Admin";

const router = express.Router();

router.put("/api/admin/resetpassword", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      email: email,
    });

    if (!existingAdmin) {
      throw new BadRequestError("Admin not found");
    }

    existingAdmin.password = password;

    await existingAdmin.save();

    const userJwt = jwt.sign(
      {
        email: existingAdmin.email,
        username: existingAdmin.username,
        id: existingAdmin.id,
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

export { router as resetAdminPasswordRouter };
