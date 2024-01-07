import express from "express";
import { updateUser } from "../controller/user.controller";

const router = express.Router();

router.put("/:id", updateUser);

module.exports = router;