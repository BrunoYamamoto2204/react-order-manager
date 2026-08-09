import express from "express"
import { checkAdmin } from "../middleware/checkRole"
import { checkPermissionAsync, getAllPermissions, modifyPermission } from "../controllers/permissionController"

const permissionRouter = express.Router()

permissionRouter.get("/get", checkAdmin(), getAllPermissions)
permissionRouter.post("/check", checkPermissionAsync)
permissionRouter.put("/modify", checkAdmin(), modifyPermission)

export default permissionRouter