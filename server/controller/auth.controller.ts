import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  verify,
  sign,
  TokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

const prisma = new PrismaClient();

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}
const generateAccessToken = (
  id: String,
  email: String,
  name: String
): String => {
  const payload = {
    id,
    email,
    name,
  };
  const accessToken = sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: "2m",
  });
  return accessToken;
};

export const handleLogin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        status: "error",
        message: "Email and password are required",
      });
      return;
    }

    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!findUser) {
      res.status(400).json({
        status: "error",
        message: "Email or password is incorrect",
      });
      return;
    } else {
      const match = await bcrypt.compare(password, findUser.password);
      const refreshTokenSecret = String(process.env.REFRESH_TOKEN_SECRET);
      if (match) {
        const accessToken = generateAccessToken(
          findUser.id as string,
          findUser.email,
          findUser.name as string
        );
        res.cookie("accessToken", accessToken, {
          maxAge: 1 * 60 * 2000,
        });
        const refreshToken = jwt.sign(
          {
            id: findUser.id,
            email: findUser.email,
            name: findUser.name,
          },
          refreshTokenSecret,
          {
            expiresIn: "1d",
          }
        );
        const updateUser = await prisma.user.update({
          where: {
            email,
          },
          data: {
            refreshToken,
          },
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.status(200).json({
          status: "success",
          message: "Login success",
          data: {
            accessToken,
            email: updateUser.email,
            name: updateUser.name,
          },
        });
      } else {
        res.status(400).json({
          status: "error",
          message: "Email or password is incorrect",
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const handleGetInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    res.status(400).json({
      status: "error",
      message: "Access token not found",
    });
    return;
  }
  try {
    const decoded = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    res.json({
      status: "success",
      message: "Get user info success",
      data: {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      },
    });
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      res.status(400).json({
        status: "error",
        message: "Access token expired",
      });
    } else if (error instanceof JsonWebTokenError) {
      res.status(400).json({
        status: "error",
        message: "Invalid access token",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  }
};

export const handleLogout = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
      res.status(400).json({
        status: "error",
        message: "Refresh token not found",
      });
      return;
    }
    const refreshToken = cookies.refreshToken;
    const findUser = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!findUser) {
      res.status(400).json({
        status: "error",
        message: "Refresh token not found",
      });
      return;
    }
    const updateUser = await prisma.user.update({
      where: {
        id: findUser.id,
      },
      data: {
        refreshToken: "",
      },
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json({
      status: "success",
      message: "Logout success",
      data: {
        email: updateUser.email,
        name: updateUser.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const handleRefreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cookies = req.cookies;
    if (!cookies.refreshToken) {
      res.status(400).json({
        status: "error",
        message: "Refresh token not found",
      });
      return;
    }
    const refreshToken = cookies.refreshToken;
    const findUser = await prisma.user.findFirst({
      where: {
        refreshToken: refreshToken,
      },
    });
    if (!findUser) {
      res.status(400).json({
        status: "error",
        message: "Refresh token not found",
      });
      return;
    }
    const accessToken = generateAccessToken(
      findUser.id as string,
      findUser.email,
      findUser.name as string
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 1 * 60 * 1000,
    });
    res.status(200).json({
      status: "success",
      message: "Refresh token success",
      data: {
        accessToken,
        email: findUser.email,
        name: findUser.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
