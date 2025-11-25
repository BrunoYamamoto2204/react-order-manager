import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.replace('Bearer ', '')

    if (!token) {
        return res.status(401).json({
            message: "(401) - Token não fornecido"
        })
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET || "secret")
        req.body.user = decode
        next()
    } catch (error) {
        return res.status(401).json({ 
            message: "(401) - Token não inválido ou expirado" 
        })
    }
}