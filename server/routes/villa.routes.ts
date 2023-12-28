import express from "express";
import { createVilla, getVilla, getVillaById } from "../controller/villa.controller";

const router = express.Router();

router.post("/villa", createVilla);
router.get("/villa", getVilla);
router.get("/villa/:id", getVillaById);

module.exports = router;