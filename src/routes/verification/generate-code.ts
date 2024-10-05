import * as nodemailer from "nodemailer";
import express, { Request, Response } from "express";

import { Verification } from "../../models/Verification";

const router = express.Router();

router.post(
  "/api/verification/generate",
  async (req: Request, res: Response) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      // check if already exists
      const existingVerification = await Verification.findOne({ email: email });
      if (existingVerification) {
        existingVerification.code = code;
        await existingVerification.save();
      } else {
        // create new verification
        const verification = Verification.build({
          email: email,
          code: code,
        });
        await verification.save();
      }

      const codeText = `Your verification code is: ${code}. Please Enter this code to verify your account.`;
      const subject = `Verification code from Foxxi`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_PASSWORD,
        },
      });

      var mailOptions = {
        from: process.env.GMAIL,
        to: email,
        subject: subject,
        text: codeText,
      };

      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error: any, info: any) {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("email sent: " + info.response);
            resolve(info);
          }
        });
      });

      res.status(200).send({ message: "Verification code sent!" });
    } catch (e) {
      console.log(e);
      res.status(400).send({ message: e });
    }
  }
);

export { router as generateCodeRouter };
