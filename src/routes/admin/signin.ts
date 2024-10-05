import jwt from "jsonwebtoken";
import { BadRequestError } from "@devion/common";
import express, { Request, Response } from "express";

import { Admin } from "../../models/Admin";
import { Password } from "../../services/password";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/api/admin/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email: email });

    if (!existingAdmin) {
      throw new Error("Admin does not exist!");
    }

    if (existingAdmin.password) {
      const passwordsMatch = await Password.compare(
        existingAdmin.password!,
        password
      );
      if (!passwordsMatch) {
        throw new BadRequestError("Invalid Credentials");
      }
    }

    // Generate JWT
    const adminJwt = jwt.sign(
      {
        email: existingAdmin.email,
        adminname: existingAdmin.username,
        id: existingAdmin.id,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: adminJwt,
    };

    res.status(200).send({
      jwt: adminJwt,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: err });
  }
});

export { router as adminSigninRouter };
