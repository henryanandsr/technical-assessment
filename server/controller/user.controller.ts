import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    // check email is already exist
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExist) {
      return res.status(400).json({
        status: "error",
        message: "Email already exist",
      });
    }
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { email, name, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await hash(password, saltRounds);

    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
