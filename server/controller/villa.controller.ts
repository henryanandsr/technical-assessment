import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createVilla = async (req: Request, res: Response) => {
  try {
    const { name, short_description, description, price, image, longitude, latitude, address, amenities} = req.body;

    const villa = await prisma.villa.create({
      data: {
        name,
        short_description,
        description,
        price,
        image,
        longitude,
        latitude,
        address,
        amenities,
      },
    });
    res.status(201).json({
        status: "success",
        message: "Villa created successfully",
        data: villa,
    });
  } catch (error: any) {
    res.status(500).json({
        status : "error",
        message : error.message,
    });
  }
};

export const getVilla = async (req: Request, res: Response) => {
  try {
    const villa = await prisma.villa.findMany();
    res.status(200).json({
      status: "success",
      message: "Villa retrieved successfully",
      data: villa,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getVillaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const villa = await prisma.villa.findUnique({
      where: {
        id: id,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Villa retrieved successfully",
      data: villa,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const updateVilla = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, short_description, description, price, image, longitude, latitude, address, amenities} = req.body;

    const villa = await prisma.villa.update({
      where: {
        id: id,
      },
      data: {
        name,
        short_description,
        description,
        price,
        image,
        longitude,
        latitude,
        address,
        amenities,
      },
    });
    res.status(201).json({
      status: "success",
      message: "Villa updated successfully",
      data: villa,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};