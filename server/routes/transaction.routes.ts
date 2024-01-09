import express from "express";
import {
  createTransaction,
  getTransaction,
  getTransactionById,
  getTransactionByUserId,
  updateTransaction,
  confirmTransaction,
} from "../controller/transaction.controller";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API for managing villa transactions
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new villa transaction
 *     tags: [Transactions]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               villaId:
 *                 type: string
 *               numberOfGuests:
 *                 type: number
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Transaction created successfully
 *               data:
 *                 id: "transaction_id"
 *                 userId: "user_id"
 *                 villaId: "villa_id"
 *                 numberOfGuests: 2
 *                 checkIn: "2024-01-09"
 *                 checkOut: "2024-01-16"
 *                 price: 500
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.post("/", createTransaction);
/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Get all transactions
 *     description: Retrieve a list of all villa transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Transactions retrieved successfully
 *               data:
 *                 - id: "transaction_id_1"
 *                   userId: "user_id_1"
 *                   villaId: "villa_id_1"
 *                   numberOfGuests: 2
 *                   checkIn: "2024-01-09"
 *                   checkOut: "2024-01-16"
 *                   price: 500
 *                 - id: "transaction_id_2"
 *                   userId: "user_id_2"
 *                   villaId: "villa_id_2"
 *                   numberOfGuests: 3
 *                   checkIn: "2024-01-15"
 *                   checkOut: "2024-01-20"
 *                   price: 700
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/", getTransaction);
/**
 * @swagger
 * /api/transactions/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     description: Retrieve details of a specific villa transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Transaction retrieved successfully
 *               data:
 *                 id: "transaction_id"
 *                 userId: "user_id"
 *                 villaId: "villa_id"
 *                 numberOfGuests: 2
 *                 checkIn: "2024-01-09"
 *                 checkOut: "2024-01-16"
 *                 price: 500
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/:id", getTransactionById);
/**
 * @swagger
 * /api/transactions/user/{userId}:
 *   get:
 *     summary: Get transactions by user ID
 *     description: Retrieve a list of villa transactions associated with a specific user
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to retrieve transactions for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Transactions retrieved successfully
 *               data:
 *                 - id: "transaction_id_1"
 *                   userId: "user_id_1"
 *                   villaId: "villa_id_1"
 *                   numberOfGuests: 2
 *                   checkIn: "2024-01-09"
 *                   checkOut: "2024-01-16"
 *                   price: 500
 *                 - id: "transaction_id_2"
 *                   userId: "user_id_1"
 *                   villaId: "villa_id_2"
 *                   numberOfGuests: 3
 *                   checkIn: "2024-01-15"
 *                   checkOut: "2024-01-20"
 *                   price: 700
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.get("/user/:userId", getTransactionByUserId);
/**
 * @swagger
 * /api/transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     description: Update details of a specific villa transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to update
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numberOfGuests:
 *                 type: number
 *               checkIn:
 *                 type: string
 *                 format: date
 *               checkOut:
 *                 type: string
 *                 format: date
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Transaction updated successfully
 *               data:
 *                 id: "transaction_id"
 *                 userId: "user_id"
 *                 villaId: "villa_id"
 *                 numberOfGuests: 3
 *                 checkIn: "2024-01-15"
 *                 checkOut: "2024-01-20"
 *                 price: 700
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.put("/:id", updateTransaction);

/**
 * @swagger
 * /api/transactions/confirm/{id}:
 *   put:
 *     summary: Confirm a transaction by ID
 *     description: Confirm a specific villa transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the transaction to confirm
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction confirmed successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Transaction confirmed successfully
 *               data:
 *                 id: "transaction_id"
 *                 userId: "user_id"
 *                 villaId: "villa_id"
 *                 numberOfGuests: 3
 *                 checkIn: "2024-01-15"
 *                 checkOut: "2024-01-20"
 *                 price: 700
 *                 confirmed: true
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               status: error
 *               message: Internal server error
 */
router.put("/confirm/:id", confirmTransaction);

module.exports = router;
