import dotenv from "dotenv";
import { TwitterApi } from "twitter-api-v2";
import { BadRequestError } from "@devion/common";

import { User } from "../../models/User";
import express, { Request, Response } from "express";
import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();
dotenv.config();

router.get(
  "/api/tweets/trending",
  currentUser,
  async (req: Request, res: Response) => {
    const { foxxiUser } = req;
    if (!foxxiUser) {
      throw new BadRequestError("User not found!");
    }

    try {
      const existingUser = await User.findOne({
        username: foxxiUser.username,
      });

      if (!existingUser) {
        throw new Error("User not found");
      }
      const TwitterClient = new TwitterApi({
        appKey: process.env.TWITTER_API_KEY!,
        appSecret: process.env.TWITTER_API_SECRET!,
        accessToken: process.env.TWITTER_ACCESS_TOKEN!,
        accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!,
      });

      const appOnlyClientFromConsumer = await TwitterClient.appLogin();
      const trendingApiResponse = await appOnlyClientFromConsumer.v2.search(
        "trending -is:retweet -is:reply -is:quote",
        {
          max_results: 90,
          "tweet.fields": ["created_at"],
        }
      );

      res.send(trendingApiResponse.data.data);
    } catch (err) {
      console.log(err);
      res.status(400).send({ message: err });
    }
  }
);

export { router as getTrendingTweetsRouter };
