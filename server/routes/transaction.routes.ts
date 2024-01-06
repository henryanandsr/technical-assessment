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

router.post("/", createTransaction);
router.get("/", getTransaction);
router.get("/:id", getTransactionById);
router.get("/user/:userId", getTransactionByUserId);
router.put("/:id", updateTransaction);
router.put("/confirm/:id", confirmTransaction);

module.exports = router;
