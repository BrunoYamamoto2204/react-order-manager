import express from "express"
import { createSecret, login, loginWithMfa, verifyUser } from "../controllers/authController"
import { jwtAuth } from "../middleware/jwtAuth"

const router = express.Router()

// router.post("/register", register)
router.post("/login", login)
router.post("/mfa", loginWithMfa)
router.post("/secret", createSecret)
router.get("/verify", jwtAuth, verifyUser)

export default router