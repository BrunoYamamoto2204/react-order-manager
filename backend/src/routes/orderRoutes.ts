import express from "express"
import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from "../controllers/orderController";
import { checkRole } from "../middleware/checkRole";

const router = express.Router();

router.get("/", checkRole("orders", "read"), getOrders);
router.get("/:id", checkRole("orders", "read"), getOrderById);
router.post("/", checkRole("orders", "create"), createOrder);
router.put("/:id", checkRole("orders", "update"), updateOrder);
router.delete("/:id", checkRole("orders", "delete"), deleteOrder);

export default router 