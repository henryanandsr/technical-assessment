import express from "express";
import { updateUser } from "../controller/user.controller";

const router = express.Router();
/**
 * @swagger
 * /api/user/{id}:
 *   put:
 *     summary: Update a user by ID
 *     description: Update details of a specific user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
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
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: User updated successfully
 *               data:
 *                 id: "user_id"
 *                 email: "updated_user@example.com"
 *                 name: "Updated User"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.put("/:id", updateUser);

module.exports = router;
