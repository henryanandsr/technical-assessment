import express from "express";
import { handleLogin, handleGetInfo, handleLogout, handleRefreshToken } from "../controller/auth.controller";

const router = express.Router();

router.post("/login", handleLogin);
router.get("/info", handleGetInfo);
router.post("/logout", handleLogout);
router.get("/refresh", handleRefreshToken);

module.exports = router;