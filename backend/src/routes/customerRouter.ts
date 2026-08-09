import express from "express"
import { createCustomer, deleteCustomer, getCustomerById, getCustomers, updateCustomer } from "../controllers/customerController"
import { checkRole } from "../middleware/checkRole"

const router = express.Router()

router.get("/", checkRole("customers", "read"), getCustomers)
router.get("/:id", checkRole("customers", "read"), getCustomerById)
router.post("/", checkRole("customers", "create"), createCustomer)
router.put("/:id", checkRole("customers", "update"), updateCustomer)
router.delete("/:id", checkRole("customers", "delete"), deleteCustomer)

export default router