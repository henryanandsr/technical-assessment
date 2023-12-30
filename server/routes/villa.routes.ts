import express from "express";
import {
  createVilla,
  getVilla,
  getVillaById,
  // getVillaImage,
} from "../controller/villa.controller";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
const crypto = require("crypto");
const path = require("path");

// const dbURL = process.env.DATABASE_URL || "";
const storage = multer.memoryStorage();
// const storage = new GridFsStorage({
//   url: dbURL,
//   file: (req: any, file: any) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err: any, buf: any) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });
const upload = multer({ storage });
const router = express.Router();

router.post("/villa", upload.single("image"), createVilla);
router.get("/villa", getVilla);
router.get("/villa/:id", getVillaById);
// router.get("/villa/img/:id", getVillaImage);

module.exports = router;
