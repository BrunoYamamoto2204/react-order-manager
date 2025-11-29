import express from "express"
import { login, verifyToken } from "../controllers/authController"
import { jwtAuth } from "../middleware/jwtAuth"

const router = express.Router()

// router.post("/register", register)
router.post("/login", login)
router.get("/verify", jwtAuth, verifyToken)

export default router