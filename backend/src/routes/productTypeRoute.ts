import express from "express"
import { createProductType, deleteProductType, getProductType, getProductTypeById, updateProductType } from "../controllers/productTypeController"
import { checkRole } from "../middleware/checkRole"

const router = express.Router()

router.get("/", checkRole("products", "read"), getProductType)
router.get("/:id", checkRole("products", "read"), getProductTypeById)
router.post("/", checkRole("products", "create"), createProductType)
router.put("/:id", checkRole("products", "update"), updateProductType)
router.delete("/:id", checkRole("products", "delete"), deleteProductType)

export default router