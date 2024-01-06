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

router.post("/villa", upload.single("image"), createVilla);
router.get("/villa", getVilla);
router.get("/villa/search", getVillaBySearchFilterAndPage);
router.get("/villa/:id", getVillaById);
router.get("/countries", getAllCountries);
router.get("/countries/:country", getCitiesOfCountry);

module.exports = router;
