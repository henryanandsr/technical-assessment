import express from "express";
import {
  handleLogin,
  handleGetInfo,
  handleLogout,
  handleRefreshToken,
} from "../controller/auth.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: User login
 *     description: Login with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Login success
 *               data:
 *                 accessToken: "your_access_token"
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *       400:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Email or password is incorrect
 */
router.post("/login", handleLogin);

/**
 * @swagger
 * /api/info:
 *   get:
 *     summary: Get user information
 *     description: Retrieve user information based on the provided access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Get user info success
 *               data:
 *                 id: "user_id"
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *       403:
 *         description: Access token not found or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Access token not found or invalid
 */
router.get("/info", handleGetInfo);

/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user by clearing access and refresh tokens
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Logout success
 *               data:
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *       400:
 *         description: Refresh token not found
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Refresh token not found
 */
router.post("/logout", handleLogout);

/**
 * @swagger
 * /api/refresh:
 *   get:
 *     summary: Refresh access token
 *     description: Refresh the access token using a valid refresh token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Refresh token success
 *               data:
 *                 accessToken: "new_access_token"
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *       400:
 *         description: Refresh token not found or invalid
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Refresh token not found or invalid
 */
router.get("/refresh", handleRefreshToken);

module.exports = router;
