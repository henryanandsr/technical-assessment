import express from "express";
import { createUser, updateUser } from "../controller/user.controller";

const router = express.Router();

router.post("/user", createUser);

module.exports = router;