import { Request, Response } from 'express';
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

// Permite a estensão do Request, permitindo usar req.user 
interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

export {}

export const register = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body

        const existingUser = await User.findOne({ user: username })
        if(existingUser) {
            return res.status(400).json({
                error: `(400) - Usuário já existente`
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            user: username,
            password: hashPassword,
            role: "admin"
        })

        await newUser.save()
        return res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({
            error: `(500) - Erro ao criar usuário: ${error}`
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const { user, password } = req.body 

        // verifica se o cliente existe
        const selectedUser = await User.findOne({ user })
        if (!selectedUser) {
            return res.status(401).json({
                message: `(401) - Falha no login! Credenciais inválidas`
            })
        }

        // verifica se a senha está correta
        const confirmPassword = await bcrypt.compare(password, selectedUser.password)
        if (!confirmPassword) {
            return res.status(401).json({
                message: `(401) - Falha no login! Credenciais inválidas`
            })
        }

        // cria o token do login
        const token = jwt.sign(
            { userId: selectedUser._id, username: selectedUser.user, role: selectedUser.role},
            process.env.JWT_SECRET || "secret",
            { expiresIn: '7d' } // Token expira em 7 dias
        )

        return res.status(200).json({
            token,
            user: {
                userId: selectedUser._id, 
                username: selectedUser.user, 
                role: selectedUser.role
            }
        })

    } catch (error) {
        return res.status(403).json({
            message: `(500) - Falha no login: ${error}`
        })
    }
}

export const verifyToken = async (req: Request, res: Response) => {
    const formattedReq = req as AuthenticatedRequest

    if (!formattedReq.user) {
        return res.status(401).json({
            valid: false,
            message: "(401) - Usuário não autenticado"
        })
    }
    
    return res.status(200).json({
        valid: true,
        user: {
            userId: formattedReq.user.userId,
            username: formattedReq.user.username,
            role: formattedReq.user.role
        }
    })
}