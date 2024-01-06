import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import "dotenv/config";
import { Prisma } from "@prisma/client";
import { Amenity } from "@prisma/client";

const prisma = new PrismaClient();

export const createVilla = async (req: Request, res: Response) => {
  try {
    const {
      name,
      short_description,
      description,
      price,
      longitude,
      latitude,
      address,
      amenities,
      city,
      country,
    } = req.body;

    const parsedPrice = parseInt(price);
    const parsedLongitude = parseFloat(longitude);
    const parsedLatitude = parseFloat(latitude);
    const parsedAmenities = JSON.parse(amenities);

    // Check if an image was provided
    if (!req.file) {
      res.status(400).json({
        status: "fail",
        message: "No image provided",
      });
      return;
    }
    // Create Villa with associated image
    const createdVilla = await prisma.villa.create({
      data: {
        name,
        short_description,
        description,
        price: parsedPrice,
        longitude: parsedLongitude,
        latitude: parsedLatitude,
        address,
        city,
        country,
        amenities: {
          set: parsedAmenities,
        },
        images: {
          create: {
            data: Buffer.from(req.file.buffer),
          },
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Villa created successfully",
      data: createdVilla,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getVilla = async (req: Request, res: Response) => {
  try {
    const villa = await prisma.villa.findMany({
      include: {
        images: true,
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

export const getVillaBySearchFilterAndPage = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      search,
      city,
      country,
      priceLow,
      priceHigh,
      amenities,
      page,
      itemsPerPage,
    } = req.query;
    const parsedPriceLow = parseInt(priceLow as string);
    const parsedPriceHigh = parseInt(priceHigh as string);
    const whereClause: Prisma.VillaWhereInput[] = [];

    if (search) {
      whereClause.push({
        name: { contains: search as string, mode: "insensitive" },
      });
    }
    if (city) {
      whereClause.push({ city: { contains: city as string } });
    }
    if (country) {
      whereClause.push({ country: { contains: country as string } });
    }
    if (priceLow) {
      whereClause.push({ price: { lte: parsedPriceLow } });
    }
    if (priceHigh) {
      whereClause.push({ price: { gte: parsedPriceHigh } });
    }
    if (amenities) {
      console.log(amenities);
      const parsedAmenities: Amenity[] = (amenities as string)
        .split(",")
        .map((amenity) => amenity.trim()) as Amenity[];
      console.log(parsedAmenities);
      whereClause.push({ amenities: { hasSome: parsedAmenities } });
    }
    const villa = await prisma.villa.findMany({
      where: {
        AND: whereClause,
      },
      include: {
        images: true,
      },
      skip: (parseInt(page as string) - 1) * parseInt(itemsPerPage as string),
      take: parseInt(itemsPerPage as string),
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

export const getAllCountries = async (req: Request, res: Response) => {
  try {
    const countries = await prisma.villa.findMany({
      select: {
        country: true,
      },
    });
    const uniqueCountries = countries.map((country) => country.country);
    res.status(200).json({
      status: "success",
      message: "Countries retrieved successfully",
      data: uniqueCountries,
    });
  } catch (error: any) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export const getCitiesOfCountry = async (req: Request, res: Response) => {
  try {
    const { country } = req.params;
    const cities = await prisma.villa.findMany({
      where: {
        country: country,
      },
      select: {
        city: true,
      },
    });
    const uniqueCities = cities.map((city) => city.city);
    res.status(200).json({
      status: "success",
      message: "Cities retrieved successfully",
      data: uniqueCities,
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
      include: {
        images: true,
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
    const {
      name,
      short_description,
      description,
      price,
      longitude,
      latitude,
      address,
      city,
      country,
      amenities,
    } = req.body;

    const villa = await prisma.villa.update({
      where: {
        id: id,
      },
      data: {
        name,
        short_description,
        description,
        price,
        longitude,
        latitude,
        address,
        city,
        country,
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
