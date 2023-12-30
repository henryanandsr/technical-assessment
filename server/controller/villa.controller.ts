import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import "dotenv/config";

import {
  MongoClient,
  GridFSBucket,
  GridFSBucketReadStream,
  MongoClientOptions,
} from "mongodb";

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
        amenities: parsedAmenities,
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
    const {
      name,
      short_description,
      description,
      price,
      longitude,
      latitude,
      address,
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
// export const getVillaImage = async (req: Request, res: Response) => {
//   try {
//     const villaId = req.params.id;
//     console.log("Villa ID:", villaId);
//     const villa = await prisma.villa.findUnique({
//       where: {
//         id: villaId,
//       },
//     });

//     if (!villa) {
//       res.status(404).json({
//         status: "fail",
//         message: "Villa not found",
//       });
//       return;
//     }
//     console.log("Villa:", villa);
//     const filename = villa.imagesFiles[0].filename;
//     console.log("Villa:", villa);
//     console.log("Images Files:", villa.imagesFiles);

//     // Use MongoDB driver to fetch and stream the image
//     const bucket = new GridFSBucket(client.db(), {
//       bucketName: "villa-reservation",
//     });
//     console.log("Bucket:", bucket);
//     const downloadStream = bucket.openDownloadStreamByName(filename);
//     downloadStream.once("finish", () => {
//       console.log("done!");
//     });
//     console.log("==========");
//     console.log(downloadStream);
//     // Set response headers
//     res.setHeader("Content-Type", "image/jpeg");
//     res.setHeader("Content-Disposition", `inline; filename=${filename}`);
//     console.log("res", res);
//     // Pipe the image stream to the response
//     downloadStream.pipe(res);
//   } catch (error: any) {
//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// };
