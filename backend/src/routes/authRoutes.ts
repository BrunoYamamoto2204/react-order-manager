import express from "express"
import { confirmUserSecret, createSecret, login, loginWithMfa, verifyUser } from "../controllers/authController"
import { jwtAuth } from "../middleware/jwtAuth"

const router = express.Router()

// router.post("/register", register)
router.post("/login", login)
router.post("/mfa", loginWithMfa)
router.post("/secret", createSecret)
router.put("/confirmSecret", confirmUserSecret)
router.get("/verify", jwtAuth, verifyUser)

export default router