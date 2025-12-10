import express from "express"
import { createProductType, deleteProductType, getProductType, getProductTypeById, updateProductType } from "../controllers/productTypeController"

const router = express.Router()

router.get("/", getProductType)
router.get("/:id", getProductTypeById)
router.post("/", createProductType)
router.put("/:id", updateProductType)
router.delete("/:id", deleteProductType)

export default router