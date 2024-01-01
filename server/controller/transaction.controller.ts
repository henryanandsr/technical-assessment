import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import "dotenv/config";

const prisma = new PrismaClient();

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const { userId, villaId, numberOfGuests, checkIn, checkOut, price } =
      req.body;

    const newTransaction = await prisma.transaction.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        villa: {
          connect: {
            id: villaId,
          },
        },
        numberOfGuests,
        checkIn,
        checkOut,
        price,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await prisma.transaction.findMany({
      include: {
        user: true,
        villa: true,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getTransactionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.findUnique({
      where: {
        id: id,
      },
      include: {
        user: true,
        villa: {
          include: {
            images: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getTransactionByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const transaction = await prisma.transaction.findMany({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        villa: {
          include: {
            images: true,
          },
        },
      },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const confirmTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.transaction.update({
      where: {
        id: id,
      },
      data: {
        confirmed: true,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction confirmed successfully",
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { numberOfGuests, checkIn, checkOut, price } = req.body;
    const transaction = await prisma.transaction.update({
      where: {
        id: id,
      },
      data: {
        numberOfGuests,
        checkIn,
        checkOut,
        price,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
