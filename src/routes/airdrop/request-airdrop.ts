import express, { Request, Response } from "express";
import * as nodemailer from "nodemailer";

const router = express.Router();

router.post("/api/airdrop/request", async (req: Request, res: Response) => {
  const { email, walletAddress, message } = req.body;

  try {
    const codeText = `${email} has requested for Foxxi Token Airdrop. Please send 50 Foxxi Tokens to ${walletAddress}. 

Message from ${email}: 
${message}`;
    const subject = `Foxxi Token Airdrop Request`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_HELP,
        pass: process.env.GMAIL_HELP_APP_PASSWORD,
      },
    });

    var mailOptions = {
      from: process.env.GMAIL_HELP,
      to: process.env.GMAIL_HELP,
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

    res.status(200).send({
      message: "Airdrop request sent. You will soon receive the foxxi tokens.",
    });
  } catch (e) {
    console.log(e);
    res.status(400).send({ message: e });
  }
});

export { router as airdropRequestRouter };
