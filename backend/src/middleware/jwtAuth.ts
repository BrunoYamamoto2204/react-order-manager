import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    const formattedReq = req as AuthenticatedRequest

    try{
        const token = req.headers['authorization']?.replace('Bearer ', '')

        if (!token) {
            return res.status(401).json({
                message: "(401) - Token não fornecido"
            })
        }
    
        // Verifica o valor do token e define os valores do user 
        const decode = jwt.verify(token, process.env.JWT_SECRET || "secret") as { 
            userId: string; username: string; role: string 
        }

        formattedReq.user = decode
        next()
    } catch (error) {
        return res.status(401).json({ 
            message: `(401) - Token não inválido ou expirado: ${error}` 
        })
    }
}