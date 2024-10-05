import express from "express";
import { User } from "../../models/User";

import { currentUser } from "../../middlewares/currentuser";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, async (req, res) => {
  const { foxxiUser } = req;
  try {
    if (foxxiUser) {
      const email = foxxiUser.email;
      const accountWallet = foxxiUser.accountWallet;
      let user;
      if (email)
        user = await User.findOne({ email: email }).populate({
          path: "following",
        });
      else if (accountWallet)
        user = await User.findOne({ accountWallet: accountWallet }).populate({
          path: "following",
        });

      if (user?.isBanned)
        return res.json({
          message: "You are temporarily banned from Foxxi",
          currentUser: undefined,
        });

      res.json({ currentUser: user });
    } else res.json({ currentUser: undefined });
  } catch (e) {
    console.log("Error: ", e);
    res.json({ currentUser: undefined, error: e });
  }
});

export { router as currentUserRouter };
