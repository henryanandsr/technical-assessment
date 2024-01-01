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

router.post("/transaction", createTransaction);
router.get("/transaction", getTransaction);
router.get("/transaction/:id", getTransactionById);
router.get("/transaction/user/:userId", getTransactionByUserId);
router.put("/transaction/:id", updateTransaction);
router.put("/transaction/confirm/:id", confirmTransaction);

module.exports = router;
