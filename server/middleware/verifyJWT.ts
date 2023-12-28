import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessTokenSecret = req.cookies.accessToken;
  try {
    jwt.verify(
      accessTokenSecret,
      process.env.ACCESS_TOKEN_SECRET as string,
      (err: any) => {
        if (err) {
          res.sendStatus(403);
        } else {
          next();
        }
      }
    );
  } catch (err) {
    res.sendStatus(403);
  }
};
