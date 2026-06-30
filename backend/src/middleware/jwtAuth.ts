import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { error } from 'node:console';

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
        
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET não definido nas variáveis de ambiente")
        }

        // Verifica o valor do token e define os valores do user 
        const decode = jwt.verify(token, process.env.JWT_SECRET) as { 
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