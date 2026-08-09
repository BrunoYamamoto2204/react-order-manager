import express from "express"
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/productController"
import { checkRole } from "../middleware/checkRole"

const router = express.Router()

router.get("/", checkRole("products", "read"), getProducts)
router.get("/:id", checkRole("products", "read"), getProductById)
router.post("/", checkRole("products", "create"), createProduct)
router.put("/:id", checkRole("products", "update"), updateProduct)
router.delete("/:id", checkRole("products", "delete"), deleteProduct)

export default router