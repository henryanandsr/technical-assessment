import express from "express";
import {
  createVilla,
  getVilla,
  getVillaById,
  getVillaBySearchFilterAndPage,
  getAllCountries,
  getCitiesOfCountry
} from "../controller/villa.controller";
import multer from "multer";
const crypto = require("crypto");
const path = require("path");

// const dbURL = process.env.DATABASE_URL || "";
const storage = multer.memoryStorage();

const upload = multer({ storage });
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Villas
 *   description: API for managing villas
 */

/**
 * @swagger
 * /api/villa:
 *   post:
 *     summary: Create a new villa
 *     description: Create a new villa with details, including an image
 *     tags: [Villas]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: The image file for the villa
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               short_description:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               longitude:
 *                 type: number
 *               latitude:
 *                 type: number
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               country:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Villa created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Villa created successfully
 *               data:
 *                 id: "villa_id"
 *                 name: "Villa Name"
 *                 short_description: "Short description"
 *                 description: "Detailed description"
 *                 price: 100
 *                 longitude: 12.345
 *                 latitude: 45.678
 *                 address: "Villa Address"
 *                 city: "City"
 *                 country: "Country"
 *                 amenities: ["Amenity1", "Amenity2"]
 *       400:
 *         description: No image provided
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: No image provided
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.post("/villa", upload.single("image"), createVilla);
/**
 * @swagger
 * /api/villa:
 *   get:
 *     summary: Get all villas
 *     description: Retrieve a list of all villas
 *     tags: [Villas]
 *     responses:
 *       200:
 *         description: Villas retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Villas retrieved successfully
 *               data:
 *                 - id: "villa_id1"
 *                   name: "Villa 1"
 *                   price: 100
 *                   images: [...]
 *                 - id: "villa_id2"
 *                   name: "Villa 2"
 *                   price: 150
 *                   images: [...]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/villa", getVilla);
/**
 * @swagger
 * /api/villa/search:
 *   get:
 *     summary: Get villas based on search criteria and pagination
 *     description: Retrieve villas based on search criteria and paginate the result
 *     tags: [Villas]
 *     parameters:
 *       - in: query
 *         name: search
 *         type: string
 *         description: Search query for villa names
 *       - in: query
 *         name: city
 *         type: string
 *         description: City filter
 *       - in: query
 *         name: country
 *         type: string
 *         description: Country filter
 *       - in: query
 *         name: priceLow
 *         type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: priceHigh
 *         type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: amenities
 *         type: string
 *         description: Comma-separated list of amenities
 *       - in: query
 *         name: page
 *         type: number
 *         description: Page number for pagination
 *       - in: query
 *         name: itemsPerPage
 *         type: number
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Villas retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Villas retrieved successfully
 *               data:
 *                 - id: "villa_id1"
 *                   name: "Villa 1"
 *                   price: 100
 *                   images: [...]
 *                 - id: "villa_id2"
 *                   name: "Villa 2"
 *                   price: 150
 *                   images: [...]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/villa/search", getVillaBySearchFilterAndPage);
/**
 * @swagger
 * /api/villa/{id}:
 *   get:
 *     summary: Get a villa by ID
 *     description: Retrieve details of a specific villa by ID
 *     tags: [Villas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the villa to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Villa retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Villa retrieved successfully
 *               data:
 *                 id: "villa_id"
 *                 name: "Villa Name"
 *                 price: 100
 *                 images: [...]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/villa/:id", getVillaById);
/**
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Get all unique countries
 *     description: Retrieve a list of all unique countries where villas are located
 *     tags: [Villas]
 *     responses:
 *       200:
 *         description: Countries retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Countries retrieved successfully
 *               data:
 *                 - "Country 1"
 *                 - "Country 2"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/countries", getAllCountries);
/**
 * @swagger
 * /api/countries/{country}:
 *   get:
 *     summary: Get all unique cities of a country
 *     description: Retrieve a list of all unique cities in a specific country where villas are located
 *     tags: [Villas]
 *     parameters:
 *       - in: path
 *         name: country
 *         required: true
 *         description: Country for which cities are to be retrieved
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cities retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Cities retrieved successfully
 *               data:
 *                 - "City 1"
 *                 - "City 2"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/countries/:country", getCitiesOfCountry);

module.exports = router;
