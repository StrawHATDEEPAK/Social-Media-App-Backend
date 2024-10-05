import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface UserPayLoad {
  email?: string;
  username: string;
  id: string;
  accountWallet?: string;
}

declare global {
  namespace Express {
    interface Request {
      foxxiUser?: UserPayLoad;
    }
  }
}
const currentUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      req.headers &&
      req.headers.cookies &&
      req.headers.cookies.includes("foxxi_jwt")
    ) {
      const token = req.headers.cookies
        .toString()
        .split("foxxi_jwt=")[1]
        .split(";")[0];
      if (!token || token === "undefined") {
        req.foxxiUser = undefined;
      } else {
        const decoded = jwt.verify(token.toString(), process.env.JWT_KEY!);
        if (!decoded) {
          //If some error occurs
          res.status(400).json({
            error: "User not Signed in, Sign in First.",
          });
        } else {
          req.foxxiUser = decoded as UserPayLoad;
        }
      }
      next();
    } else {
      res.send({ currentuser: null });
    }
  } catch (e) {
    res.json({
      currentUser: undefined,
      message: "Malformed jwt token",
    });
  }
};

export { currentUser };
