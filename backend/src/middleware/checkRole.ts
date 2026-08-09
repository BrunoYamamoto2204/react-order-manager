import { Request, Response, NextFunction } from 'express'
import { checkPermission } from '../controllers/permissionController';
import { PermissionsType } from '../models/PermissionModel';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

export const checkAdmin = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const formattedReq = req as AuthenticatedRequest
        const role = formattedReq.user?.role
        
        if (role !== "admin"){
            return res.status(403).json({
                message: "Acesso negado"
            })
        }

        next()
    }
}

export const checkRole = (module: keyof PermissionsType, permission: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const formattedReq = req as AuthenticatedRequest
        const userRole = formattedReq.user?.role

        const content = {
            role: userRole!, 
            module: module, 
            permission: permission
        }

        const allowed = await checkPermission(content)

        if (!allowed){
            return res.status(403).json({
                message: "Acesso negado"
            })
        }

        next()
    }
}