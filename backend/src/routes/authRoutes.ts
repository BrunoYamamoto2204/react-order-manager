import express from "express"
import { login, register, verifyToken } from "../controllers/authController"

const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/verify", verifyToken)

export default router