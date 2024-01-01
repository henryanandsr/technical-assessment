import express from "express";
import {
  createTransaction,
  getTransaction,
  getTransactionById,
  getTransactionByUserId,
} from "../controller/transaction.controller";

const router = express.Router();

router.post("/transaction", createTransaction);
router.get("/transaction", getTransaction);
router.get("/transaction/:id", getTransactionById);
router.get("/transaction/user/:userId", getTransactionByUserId);

module.exports = router;
