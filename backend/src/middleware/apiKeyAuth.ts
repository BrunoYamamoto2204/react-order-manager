import { NextFunction, Request, Response } from "express"

export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers["x-api-key"]

    if (!apiKey || apiKey !== process.env.API_SECRET_KEY) {
        return res.status(403).json({
            error: "Acesso Negado - API KEY Inválida" 
        })
    }

    next()
}