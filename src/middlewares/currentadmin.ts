import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface AdminPayLoad {
  email?: string;
  username: string;
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AdminPayLoad;
    }
  }
}

const currentAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.headers &&
      req.headers.cookies &&
      req.headers.cookies.includes("admin_jwt")
    ) {
      const token = req.headers.cookies
        .toString()
        .split("admin_jwt=")[1]
        .split(";")[0];
      if (!token || token === "undefined") {
        req.admin = undefined;
      } else {
        const decoded = jwt.verify(token.toString(), process.env.JWT_KEY!);
        if (!decoded) {
          //If some error occurs
          res.status(400).json({
            error: "Admin not Signed in, Sign in First.",
          });
        } else {
          req.admin = decoded as AdminPayLoad;
        }
      }
      next();
    } else {
      res.send({ currentAdmin: null });
    }
  } catch (e) {
    res.status(400).json({
      error: "Malformed jwt token",
    });
  }
};

export { currentAdmin };
