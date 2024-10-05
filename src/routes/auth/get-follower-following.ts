import express from "express";
import { User } from "../../models/User";

import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get("/api/users/get/social", currentUser, async (req, res) => {
  const { foxxiUser } = req;
  try {
    if (foxxiUser) {
      const email = foxxiUser.email;
      const accountWallet = foxxiUser.accountWallet;
      let user;
      if (email)
        user = await User.findOne({ email: email })
          .populate({
            path: "following",
          })
          .populate({
            path: "followers",
          });
      else if (accountWallet)
        user = await User.findOne({ accountWallet: accountWallet })
          .populate({
            path: "following",
          })
          .populate({
            path: "followers",
          });

      if (user?.isBanned)
        return res.json({
          message: "You are temporarily banned from Foxxi",
          currentUser: undefined,
        });

      // only get followers and following
      const followers = user?.followers;
      const following = user?.following;

      res.json({
        followers: followers,
        following: following,
      });
    } else res.json({ currentUser: undefined });
  } catch (e) {
    console.log("Error: ", e);
    res.json({ currentUser: undefined, error: e });
  }
});

export { router as getFollowerFollowingRouter };
