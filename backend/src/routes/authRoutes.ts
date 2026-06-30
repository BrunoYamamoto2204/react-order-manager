import express from "express"
import { login, verifyUser } from "../controllers/authController"
import { jwtAuth } from "../middleware/jwtAuth"

const router = express.Router()

// router.post("/register", register)
router.post("/login", login)
router.get("/verify", jwtAuth, verifyUser)

export default router