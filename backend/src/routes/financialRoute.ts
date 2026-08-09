import express from "express"
import { createIncomeExpense, deleteIncomeExpense, getIncomeExpenseById, getIncomesExpenses, updateIncomeExpense } from "../controllers/financialController"
import { checkRole } from "../middleware/checkRole"

const router = express.Router()

router.get("/", checkRole("financial", "read"), getIncomesExpenses)
router.get("/:id", checkRole("financial", "read"), getIncomeExpenseById)
router.post("/", checkRole("financial", "create"), createIncomeExpense)
router.put("/:id", checkRole("financial", "update"), updateIncomeExpense)
router.delete("/:id", checkRole("financial", "delete"), deleteIncomeExpense)

export default router