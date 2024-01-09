import express from "express";
import { createUser } from "../controller/user.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with email, name, and password
 *     tags: [Users]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: User created successfully
 *               data:
 *                 id: "user_id"
 *                 email: "user@example.com"
 *                 name: "John Doe"
 *       400:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Email already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.post("/user", createUser);

module.exports = router;