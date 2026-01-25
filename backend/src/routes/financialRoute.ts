import express from "express"
import { createIncomeExpense, deleteIncomeExpense, getIncomeExpenseById, getIncomesExpenses, updateIncomeExpense } from "../controllers/financialController"

const router = express.Router()

router.get("/", getIncomesExpenses)
router.get("/:id", getIncomeExpenseById)
router.post("/", createIncomeExpense)
router.put("/:id", updateIncomeExpense)
router.delete("/:id", deleteIncomeExpense)

export default router