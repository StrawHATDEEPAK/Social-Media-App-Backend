import express from "express";
import { Admin } from "../../models/Admin";

import { currentAdmin } from "../../middlewares/currentadmin";

const router = express.Router();

router.get("/api/admin/currentadmin", currentAdmin, async (req, res) => {
  const { admin } = req;
  if (admin) {
    const email = admin.email;

    const currentAdmin = await Admin.findOne({ email: email });

    res.json({ currentAdmin: currentAdmin });
  } else res.json({ currentAdmin: undefined });
});

export { router as currentAdminRouter };
