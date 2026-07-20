import { Request, Response, NextFunction } from 'express'

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

export const checkRole = (req: Request, res: Response, next: NextFunction) => {
    const formattedReq = req as AuthenticatedRequest
    const userRole = formattedReq.user?.role

    if (userRole !== "admin"){
        return res.status(404).json({
            message: "Acesso negado"
        })
    }

    next()
}